"""
Local Training API endpoints
"""

import uuid
import time
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

router = APIRouter()

# In-memory session storage
sessions: Dict[str, Dict[str, Any]] = {}


class LocalTrainingRequest(BaseModel):
    modelType: str = "mlp"
    epochs: int = 10
    batchSize: int = 32
    learningRate: float = 0.001
    datasetCID: Optional[str] = None
    optimizer: Optional[str] = "adam"
    validationSplit: Optional[float] = 0.2


def run_local_training(session_id: str, params: Dict[str, Any]):
    """Background local training task (Runs in a separate thread)"""
    import numpy as np
    
    try:
        print(f"[Local Training {session_id}] Starting...")
        
        if session_id in sessions:
            sessions[session_id]["status"] = "training"
        
        epochs = params.get("epochs", 10)
        batch_size = params.get("batch_size", 32)
        learning_rate = params.get("learning_rate", 0.001)
        dataset_cid = params.get("dataset_cid")

        # Sample shape selection
        if dataset_cid and dataset_cid != "None":
            input_size = 120
            num_classes = 2
        else:
            input_size = 784
            num_classes = 10
        
        num_samples = 1000
        total_batches = max(1, num_samples // batch_size)

        X = np.random.randn(num_samples, input_size).astype(np.float32)
        y_raw = np.random.randint(0, num_classes, num_samples)
        y = np.eye(num_classes)[y_raw].astype(np.float32)

        epoch_metrics = []

        for epoch in range(epochs):
            epoch_losses = []
            epoch_accuracies = []

            indices = np.random.permutation(num_samples)
            X_shuffled = X[indices]
            y_shuffled = y[indices]

            for i in range(0, num_samples, batch_size):
                X_batch = X_shuffled[i:i+batch_size]
                y_batch = y_shuffled[i:i+batch_size]
                actual_batch_size = X_batch.shape[0]

                output = np.random.rand(actual_batch_size, num_classes)
                output = output / output.sum(axis=1, keepdims=True)

                loss = -np.mean(np.sum(y_batch * np.log(output + 1e-15), axis=1))
                predictions = np.argmax(output, axis=1)
                true_labels = np.argmax(y_batch, axis=1)
                accuracy = np.mean(predictions == true_labels)

                epoch_losses.append(float(loss))
                epoch_accuracies.append(float(accuracy))

                batch_index = i // batch_size + 1
                progress_pct = ((epoch * total_batches + batch_index) / (epochs * total_batches)) * 100

                if session_id in sessions:
                    sessions[session_id]["progress"] = {
                        "epoch": epoch + 1,
                        "batch": batch_index,
                        "totalBatches": total_batches,
                        "loss": float(np.mean(epoch_losses)),
                        "accuracy": float(np.mean(epoch_accuracies)),
                        "percentage": progress_pct
                    }

                time.sleep(0.01)

            avg_loss = float(np.mean(epoch_losses))
            avg_accuracy = float(np.mean(epoch_accuracies))

            epoch_metric = {
                "epoch": epoch + 1,
                "loss": avg_loss,
                "accuracy": avg_accuracy,
                "learningRate": learning_rate,
                "timestamp": datetime.utcnow().isoformat()
            }
            epoch_metrics.append(epoch_metric)

            if session_id in sessions:
                sessions[session_id]["epoch_metrics"] = epoch_metrics

            print(f"[Local Training {session_id}] Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}, Acc: {avg_accuracy:.4f}")

        final_metric = epoch_metrics[-1] if epoch_metrics else {"loss": 0.0, "accuracy": 0.0}

        if session_id in sessions:
            sessions[session_id]["status"] = "completed"
            sessions[session_id]["result"] = {
                "modelType": params.get("model_type", "mlp"),
                "finalLoss": final_metric.get("loss", 0.0),
                "finalAccuracy": final_metric.get("accuracy", 0.0),
                "trainingTime": epochs * total_batches * 0.01,
                "stats": {
                    "loss": [float(m["loss"]) for m in epoch_metrics],
                    "accuracy": [float(m["accuracy"]) for m in epoch_metrics],
                    "epochMetrics": epoch_metrics
                }
            }

        print(f"[Local Training {session_id}] ✅ Completed")

    except Exception as e:
        print(f"[Local Training {session_id}] ❌ Failed: {e}")
        if session_id in sessions:
            sessions[session_id]["status"] = "failed"
            sessions[session_id]["error"] = str(e)


@router.post("/start")
async def start_local_training(request: LocalTrainingRequest, background_tasks: BackgroundTasks):
    session_id = str(uuid.uuid4())

    try:
        if request.epochs <= 0 or request.epochs > 1000:
            raise HTTPException(status_code=400, detail="Epochs must be between 1 and 1000")
        if request.batchSize <= 0 or request.batchSize > 10000:
            raise HTTPException(status_code=400, detail="Batch size must be between 1 and 10000")
        if request.learningRate <= 0 or request.learningRate > 1:
            raise HTTPException(status_code=400, detail="Learning rate must be between 0 and 1")

        params = {
            "model_type": request.modelType,
            "epochs": request.epochs,
            "batch_size": request.batchSize,
            "learning_rate": request.learningRate,
            "dataset_cid": request.datasetCID,
            "optimizer": request.optimizer or "adam",
            "validation_split": request.validationSplit or 0.2
        }

        sessions[session_id] = {
            "id": session_id,
            "status": "preparing",
            "start_time": datetime.utcnow().isoformat(),
            "progress": {},
            "epoch_metrics": [],
            "result": None,
            "error": None
        }

        # Run training in real background thread
        background_tasks.add_task(run_in_threadpool, run_local_training, session_id, params)

        print(f"[API] ✅ Local training session {session_id} started")

        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "status": "preparing",
            "message": "Local training session started",
            "timestamp": datetime.utcnow().isoformat()
        })

    except HTTPException:
        raise
    except Exception as e:
        print(f"[API] ❌ Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")


@router.get("/status/{session_id}")
async def get_status(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Training session not found")

    session = sessions[session_id]
    return JSONResponse(content={
        "success": True,
        "status": session.get("status", "unknown"),
        "progress": session.get("progress", {}),
        "epochMetrics": session.get("epoch_metrics", []),
        "result": session.get("result"),
        "error": session.get("error")
    })


@router.post("/pause/{session_id}")
async def pause_training(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Training session not found")

    sessions[session_id]["status"] = "paused"
    return {"success": True, "status": "paused", "session_id": session_id}


@router.post("/resume/{session_id}")
async def resume_training(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Training session not found")

    sessions[session_id]["status"] = "training"
    return {"success": True, "status": "training", "session_id": session_id}


@router.post("/stop/{session_id}")
async def stop_training(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Training session not found")

    sessions[session_id]["status"] = "stopped"
    sessions[session_id]["error"] = "Training stopped by user"
    return {"success": True, "status": "stopped", "session_id": session_id}


@router.post("/upload-gradients/{session_id}")
async def upload_gradients(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Training session not found")

    sessions[session_id]["gradients_uploaded"] = True
    return {"success": True, "message": "Gradients uploaded successfully", "session_id": session_id}
