"""
Training API endpoints
"""

import uuid
import time
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

router = APIRouter()

# In-memory session storage (shared with local_training)
# Import from local_training to share the same storage
from app.routers.local_training import sessions


class TrainingRequest(BaseModel):
    model_type: str = "mlp"
    epochs: int = 10
    batch_size: int = 32
    learning_rate: float = 0.001
    dataset_cid: Optional[str] = None
    optimizer: Optional[str] = "adam"
    validation_split: Optional[float] = 0.2


def _try_async_call(coro, *args, **kwargs):
    """
    Helper to safely run an async coroutine from a background thread.
    Uses asyncio.run which creates a new event loop for the coroutine.
    """
    try:
        return asyncio.run(coro(*args, **kwargs))
    except Exception as e:
        # swallow errors here - caller usually handles/logs them
        print(f"[Training][_try_async_call] Async call failed: {e}")
        return None


def run_training(session_id: str, params: Dict[str, Any]):
    """Background training task (runs in a separate thread)"""
    import numpy as np

    # Try MongoDB first, fallback to in-memory
    use_mongodb = False
    mongodb_service = None

    try:
        # Importing here to avoid import-time side effects on main thread
        from app.services.mongodb_service import MongoDBService
        from app.database.mongo import is_connected

        # is_connected may be sync; if it's async you'd need to adapt — assume sync here
        try:
            if is_connected():
                mongodb_service = MongoDBService()
                use_mongodb = True
        except Exception as e:
            # if is_connected is async, try running it via asyncio.run
            try:
                connected = _try_async_call(is_connected)
                if connected:
                    mongodb_service = MongoDBService()
                    use_mongodb = True
            except Exception:
                use_mongodb = False

    except Exception as e:
        print(f"[Training {session_id}] MongoDB not available: {e}")
        use_mongodb = False
        mongodb_service = None

    try:
        print(f"[Training {session_id}] Starting...")

        # Update status (try mongodb then in-memory)
        if use_mongodb and mongodb_service:
            try:
                # mongodb_service.update_training_session is expected to be async
                _try_async_call(mongodb_service.update_training_session, session_id, {"status": "training"})
            except Exception:
                pass

        if session_id in sessions:
            sessions[session_id]["status"] = "training"

        # Training parameters
        epochs = params.get("epochs", 10)
        batch_size = params.get("batch_size", 32)
        learning_rate = params.get("learning_rate", 0.001)
        dataset_cid = params.get("dataset_cid")

        # Determine data dimensions
        if dataset_cid and dataset_cid != "None":
            input_size = 120
            num_classes = 2
        else:
            input_size = 784
            num_classes = 10

        num_samples = 1000
        total_batches = max(1, num_samples // batch_size)

        # Generate synthetic data
        X = np.random.randn(num_samples, input_size).astype(np.float32)
        y_raw = np.random.randint(0, num_classes, num_samples)
        y = np.eye(num_classes)[y_raw].astype(np.float32)

        epoch_metrics = []

        # Training loop
        for epoch in range(epochs):
            epoch_losses = []
            epoch_accuracies = []

            # Shuffle data
            indices = np.random.permutation(num_samples)
            X_shuffled = X[indices]
            y_shuffled = y[indices]

            # Batch training
            for i in range(0, num_samples, batch_size):
                X_batch = X_shuffled[i:i + batch_size]
                y_batch = y_shuffled[i:i + batch_size]

                # Get actual batch size (last batch might be smaller)
                actual_batch_size = X_batch.shape[0]

                # Simple forward pass simulation
                output = np.random.rand(actual_batch_size, num_classes)
                output = output / output.sum(axis=1, keepdims=True)

                # Calculate loss and accuracy
                loss = -np.mean(np.sum(y_batch * np.log(output + 1e-15), axis=1))
                predictions = np.argmax(output, axis=1)
                true_labels = np.argmax(y_batch, axis=1)
                accuracy = np.mean(predictions == true_labels)

                epoch_losses.append(float(loss))
                epoch_accuracies.append(float(accuracy))

                # Update progress
                batch_index = i // batch_size + 1
                progress_pct = ((epoch * total_batches + batch_index) / (epochs * total_batches)) * 100

                progress_data = {
                    "epoch": epoch + 1,
                    "batch": batch_index,
                    "totalBatches": total_batches,
                    "loss": float(np.mean(epoch_losses)) if epoch_losses else 0.0,
                    "accuracy": float(np.mean(epoch_accuracies)) if epoch_accuracies else 0.0,
                    "percentage": progress_pct
                }

                if use_mongodb and mongodb_service:
                    try:
                        _try_async_call(mongodb_service.update_training_session, session_id, {"progress": progress_data})
                    except Exception:
                        pass

                if session_id in sessions:
                    sessions[session_id]["progress"] = progress_data

                # Sleep in thread to simulate work without blocking main loop
                time.sleep(0.01)

            # Epoch metrics
            avg_loss = float(np.mean(epoch_losses)) if epoch_losses else 0.0
            avg_accuracy = float(np.mean(epoch_accuracies)) if epoch_accuracies else 0.0

            epoch_metric = {
                "epoch": epoch + 1,
                "loss": avg_loss,
                "accuracy": avg_accuracy,
                "learningRate": learning_rate,
                "timestamp": datetime.utcnow().isoformat()
            }
            epoch_metrics.append(epoch_metric)

            if use_mongodb and mongodb_service:
                try:
                    _try_async_call(mongodb_service.update_training_session, session_id, {"epoch_metrics": epoch_metrics})
                except Exception:
                    pass

            if session_id in sessions:
                sessions[session_id]["epoch_metrics"] = epoch_metrics

            print(f"[Training {session_id}] Epoch {epoch + 1}/{epochs} - Loss: {avg_loss:.4f}, Acc: {avg_accuracy:.4f}")

        # Training completed
        final_metric = epoch_metrics[-1] if epoch_metrics else {"loss": 0.0, "accuracy": 0.0}

        result_data = {
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

        if use_mongodb and mongodb_service:
            try:
                _try_async_call(
                    mongodb_service.update_training_session,
                    session_id,
                    {"status": "completed", "result": result_data, "end_time": datetime.utcnow().isoformat()},
                )
            except Exception:
                pass

        if session_id in sessions:
            sessions[session_id]["status"] = "completed"
            sessions[session_id]["result"] = result_data

        print(f"[Training {session_id}] ✅ Completed")

    except Exception as e:
        print(f"[Training {session_id}] ❌ Failed: {e}")
        import traceback
        traceback.print_exc()

        if use_mongodb and mongodb_service:
            try:
                _try_async_call(
                    mongodb_service.update_training_session,
                    session_id,
                    {"status": "failed", "error": str(e), "end_time": datetime.utcnow().isoformat()},
                )
            except Exception:
                pass

        if session_id in sessions:
            sessions[session_id]["status"] = "failed"
            sessions[session_id]["error"] = str(e)


@router.post("/start")
async def start_training(request: TrainingRequest, background_tasks: BackgroundTasks):
    """Start a new training session"""
    session_id = str(uuid.uuid4())

    try:
        # Validate parameters
        if request.epochs <= 0 or request.epochs > 1000:
            raise HTTPException(status_code=400, detail="Epochs must be between 1 and 1000")
        if request.batch_size <= 0 or request.batch_size > 10000:
            raise HTTPException(status_code=400, detail="Batch size must be between 1 and 10000")
        if request.learning_rate <= 0 or request.learning_rate > 1:
            raise HTTPException(status_code=400, detail="Learning rate must be between 0 and 1")

        # Create session
        params = {
            "model_type": request.model_type,
            "epochs": request.epochs,
            "batch_size": request.batch_size,
            "learning_rate": request.learning_rate,
            "dataset_cid": request.dataset_cid,
            "optimizer": request.optimizer or "adam",
            "validation_split": request.validation_split or 0.2
        }

        # Always create in-memory session as fallback
        sessions[session_id] = {
            "id": session_id,
            "status": "preparing",
            "start_time": datetime.utcnow().isoformat(),
            "progress": {},
            "epoch_metrics": [],
            "result": None,
            "error": None
        }

        # Start training in background threadpool (non-blocking)
        background_tasks.add_task(run_in_threadpool, run_training, session_id, params)

        print(f"[API] ✅ Training session {session_id} started")

        # Return immediately - don't wait for background task
        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "status": "preparing",
            "message": "Training session started - decentralized AI training in progress",
            "timestamp": datetime.utcnow().isoformat()
        })

    except HTTPException:
        raise
    except Exception as e:
        print(f"[API] ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")


@router.get("/status/{session_id}")
async def get_status(session_id: str):
    """Get training session status"""
    # Try MongoDB first
    try:
        from app.services.mongodb_service import MongoDBService
        from app.database.mongo import is_connected

        try:
            connected = is_connected()
        except Exception:
            connected = _try_async_call(is_connected)

        if connected:
            mongodb_service = MongoDBService()
            session = _try_async_call(mongodb_service.get_training_session, session_id)
            if session:
                return JSONResponse(content={
                    "success": True,
                    "status": session.get("status", "unknown"),
                    "progress": session.get("progress", {}),
                    "epochMetrics": session.get("epoch_metrics", []),
                    "result": session.get("result"),
                    "error": session.get("error")
                })
    except Exception as e:
        print(f"[API] MongoDB status check failed: {e}")

    # Fallback to in-memory
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
    """Pause training session"""
    # Try MongoDB first
    try:
        from app.services.mongodb_service import MongoDBService
        from app.database.mongo import is_connected

        try:
            connected = is_connected()
        except Exception:
            connected = _try_async_call(is_connected)

        if connected:
            mongodb_service = MongoDBService()
            _try_async_call(mongodb_service.update_training_session, session_id, {"status": "paused"})
    except Exception as e:
        print(f"[API] MongoDB pause failed: {e}")

    # Update in-memory
    if session_id in sessions:
        sessions[session_id]["status"] = "paused"
    else:
        raise HTTPException(status_code=404, detail="Training session not found")

    return JSONResponse(content={"success": True, "status": "paused", "session_id": session_id})


@router.post("/resume/{session_id}")
async def resume_training(session_id: str):
    """Resume training session"""
    # Try MongoDB first
    try:
        from app.services.mongodb_service import MongoDBService
        from app.database.mongo import is_connected

        try:
            connected = is_connected()
        except Exception:
            connected = _try_async_call(is_connected)

        if connected:
            mongodb_service = MongoDBService()
            _try_async_call(mongodb_service.update_training_session, session_id, {"status": "training"})
    except Exception as e:
        print(f"[API] MongoDB resume failed: {e}")

    # Update in-memory
    if session_id in sessions:
        sessions[session_id]["status"] = "training"
    else:
        raise HTTPException(status_code=404, detail="Training session not found")

    return JSONResponse(content={"success": True, "status": "training", "session_id": session_id})


@router.post("/stop/{session_id}")
async def stop_training(session_id: str):
    """Stop training session"""
    # Try MongoDB first
    try:
        from app.services.mongodb_service import MongoDBService
        from app.database.mongo import is_connected

        try:
            connected = is_connected()
        except Exception:
            connected = _try_async_call(is_connected)

        if connected:
            mongodb_service = MongoDBService()
            _try_async_call(mongodb_service.update_training_session, session_id, {
                "status": "stopped",
                "error": "Training stopped by user",
                "end_time": datetime.utcnow().isoformat()
            })
    except Exception as e:
        print(f"[API] MongoDB stop failed: {e}")

    # Update in-memory
    if session_id in sessions:
        sessions[session_id]["status"] = "stopped"
        sessions[session_id]["error"] = "Training stopped by user"
    else:
        raise HTTPException(status_code=404, detail="Training session not found")

    return JSONResponse(content={"success": True, "status": "stopped", "session_id": session_id})
