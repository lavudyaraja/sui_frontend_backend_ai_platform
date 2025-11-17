"""
Local training routes for Sui-DAT backend.
Endpoints to start and monitor local training processes with datasets.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import asyncio
import uuid
from datetime import datetime
import numpy as np

# Import services
from app.services.training_service import TrainingService
from app.ai.trainer import Trainer
from app.services.mongodb_service import MongoDBService

router = APIRouter(tags=["local-training"])

# Initialize services
training_service = TrainingService()
mongodb_service = MongoDBService()

# Remove local storage - all data will be stored in MongoDB
# active_sessions: Dict[str, Dict[str, Any]] = {}

class StartTrainingRequest(BaseModel):
    modelType: str = "mlp"
    epochs: int = 10
    batchSize: int = 32
    learningRate: float = 0.001
    datasetCID: Optional[str] = None
    optimizer: Optional[str] = "adam"
    validationSplit: Optional[float] = 0.2


def convert_to_serializable(obj: Any) -> Any:
    """Recursively convert numpy types to Python native types"""
    if isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    return obj


async def run_training(session_id: str, params: Dict[str, Any]):
    """Run the actual training process in background"""
    try:
        # Get session from MongoDB instead of local storage
        db_session = await mongodb_service.get_training_session(session_id)
        if not db_session:
            print(f"Session {session_id} not found in MongoDB")
            return
        
        # Update session status to 'training'
        await mongodb_service.update_training_session(session_id, {"status": "training"})
        
        # Initialize trainer
        trainer = Trainer("local_model", params)
        
        # Training parameters
        epochs = params.get("epochs", 10)
        batch_size = params.get("batch_size", 32)
        learning_rate = params.get("learning_rate", 0.001)
        
        # Generate synthetic data for demo
        num_samples = 1000
        input_size = 784
        num_classes = 10
        
        X = np.random.randn(num_samples, input_size).astype(np.float32)
        y = np.eye(num_classes)[np.random.choice(num_classes, num_samples)].astype(np.float32)
        
        total_batches = num_samples // batch_size
        
        # Initialize epoch metrics in MongoDB
        epoch_metrics = []
        
        # Training loop
        for epoch in range(epochs):
            # Check if training should stop by checking MongoDB
            current_session = await mongodb_service.get_training_session(session_id)
            if not current_session or current_session.get("status") != "training":
                break
            
            epoch_losses = []
            epoch_accuracies = []
            
            # Shuffle data
            indices = np.random.permutation(num_samples)
            X_shuffled = X[indices]
            y_shuffled = y[indices]
            
            # Batch training
            for i in range(0, num_samples, batch_size):
                # Check if paused by checking MongoDB
                current_session = await mongodb_service.get_training_session(session_id)
                while current_session and current_session.get("status") == "paused":
                    await asyncio.sleep(0.5)
                    current_session = await mongodb_service.get_training_session(session_id)
                
                # Check if stopped
                if not current_session or current_session.get("status") not in ["training", "paused"]:
                    break
                
                batch_index = i // batch_size + 1
                X_batch = X_shuffled[i:i+batch_size]
                y_batch = y_shuffled[i:i+batch_size]
                
                # Perform training step
                metrics = trainer.train_step(X_batch, y_batch)
                epoch_losses.append(metrics["loss"])
                epoch_accuracies.append(metrics["accuracy"])
                
                # Update session progress in MongoDB
                if isinstance(current_session["start_time"], str):
                    elapsed_time = (datetime.utcnow() - datetime.fromisoformat(current_session["start_time"])).total_seconds()
                else:
                    elapsed_time = (datetime.utcnow() - current_session["start_time"]).total_seconds()
                progress_pct = ((epoch * total_batches + batch_index) / (epochs * total_batches))
                
                progress_data = {
                    "epoch": int(epoch + 1),
                    "batch": int(batch_index),
                    "totalBatches": int(total_batches),
                    "loss": float(np.mean(epoch_losses)),
                    "accuracy": float(np.mean(epoch_accuracies)),
                    "percentage": float(progress_pct * 100),
                    "timeElapsed": int(elapsed_time),
                    "estimatedTimeRemaining": int((1 - progress_pct) / progress_pct * elapsed_time) if progress_pct > 0 else 0
                }
                
                await mongodb_service.update_training_session(session_id, {"progress": progress_data})
                
                await asyncio.sleep(0.2)  # Simulate processing time
            
            # Check if stopped during batch loop
            current_session = await mongodb_service.get_training_session(session_id)
            if not current_session or current_session.get("status") not in ["training", "paused"]:
                break
            
            # Calculate epoch metrics
            avg_loss = float(np.mean(epoch_losses))
            avg_accuracy = float(np.mean(epoch_accuracies))
            
            epoch_metric = {
                "epoch": int(epoch + 1),
                "loss": avg_loss,
                "accuracy": avg_accuracy,
                "learningRate": float(learning_rate),
                "duration": 0.2 * total_batches,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            epoch_metrics.append(epoch_metric)
            
            # Update epoch metrics in MongoDB
            await mongodb_service.update_training_session(session_id, {"epochMetrics": epoch_metrics})
            
            print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f} - Accuracy: {avg_accuracy:.4f}")
        
        # Training completed
        current_session = await mongodb_service.get_training_session(session_id)
        if current_session and current_session.get("status") == "training":
            end_time = datetime.utcnow()
            
            # Get model weights as serializable format
            model_weights = trainer.get_model_weights()
            
            # Create result with all data as serializable types
            final_metric = epoch_metrics[-1] if epoch_metrics else {}
            
            # Handle start_time conversion
            if isinstance(current_session["start_time"], str):
                training_time = int((end_time - datetime.fromisoformat(current_session["start_time"])).total_seconds())
            else:
                training_time = int((end_time - current_session["start_time"]).total_seconds())
                
            result_data = {
                "modelType": params.get("model_type", "mlp"),
                "finalLoss": float(final_metric.get("loss", 0.0)),
                "finalAccuracy": float(final_metric.get("accuracy", 0.0)),
                "trainingTime": training_time,
                "gradients": convert_to_serializable(model_weights),
                "stats": {
                    "loss": [float(m["loss"]) for m in epoch_metrics],
                    "accuracy": [float(m["accuracy"]) for m in epoch_metrics],
                    "epochMetrics": convert_to_serializable(epoch_metrics)
                },
                "metadata": {
                    "optimizer": params.get("optimizer", "adam"),
                    "batchSize": int(params.get("batch_size", 32)),
                    "learningRate": float(params.get("learning_rate", 0.001)),
                    "datasetCID": params.get("dataset_cid"),
                    "averageBatchTime": 0.2
                }
            }
            
            # Update training session in MongoDB with final results
            try:
                # Handle start_time conversion
                if isinstance(current_session["start_time"], str):
                    training_time = int((end_time - datetime.fromisoformat(current_session["start_time"])).total_seconds())
                else:
                    training_time = int((end_time - current_session["start_time"]).total_seconds())
                    
                metrics = {
                    "final_accuracy": float(final_metric.get("accuracy", 0.0)),
                    "final_loss": float(final_metric.get("loss", 0.0)),
                    "training_time": training_time,
                    "epoch_metrics": epoch_metrics
                }
                
                await mongodb_service.update_training_session(
                    session_id, 
                    {
                        "status": "completed",
                        "result": result_data,
                        "metrics": metrics,
                        "end_time": end_time
                    }
                )
                
                # Update model accuracy in MongoDB
                model_id = current_session.get("model_id", f"model_{session_id[:8]}")
                await mongodb_service.update_model(
                    model_id,
                    {
                        "accuracy": float(final_metric.get("accuracy", 0.0)),
                        "updated_at": end_time
                    }
                )
                
                print(f"Updated MongoDB with training results for session {session_id}")
            except Exception as e:
                print(f"Failed to update MongoDB with training results: {e}")
            
            print(f"Training session {session_id} completed successfully")
        
    except Exception as e:
        # Update training session in MongoDB with failure status
        try:
            await mongodb_service.update_training_session(
                session_id, 
                {
                    "status": "failed",
                    "error": str(e),
                    "end_time": datetime.utcnow()
                }
            )
            print(f"Updated MongoDB with failure status for session {session_id}")
        except Exception as db_e:
            print(f"Failed to update MongoDB with failure status: {db_e}")
        
        print(f"Training failed: {e}")
        import traceback
        traceback.print_exc()


@router.post("/start")
async def start_local_training(request: StartTrainingRequest, background_tasks: BackgroundTasks):
    """Start a new local training session"""
    try:
        session_id = str(uuid.uuid4())
        
        # Store session parameters
        params = {
            "model_type": request.modelType,
            "epochs": request.epochs,
            "batch_size": request.batchSize,
            "learning_rate": request.learningRate,
            "dataset_cid": request.datasetCID,
            "optimizer": request.optimizer,
            "validation_split": request.validationSplit
        }
        
        # Create training session in MongoDB instead of local storage
        from app.database.models import TrainingSession
        training_session = TrainingSession(
            id=session_id,
            model_id=f"model_{session_id[:8]}",
            contributor_id="demo_contributor",
            status="preparing",
            metrics={},
            start_time=datetime.utcnow()
        )
        session_db_id = await mongodb_service.create_training_session(training_session)
        print(f"Created training session in MongoDB with ID: {session_db_id}")
        
        # Create model info in MongoDB
        from app.database.models import ModelInfo
        model_info = ModelInfo(
            id=f"model_{session_id[:8]}",
            name=f"Model {session_id[:8]}",
            description=f"Neural network model trained with {request.modelType}",
            version="1.0.0",
            accuracy=0.0
        )
        model_db_id = await mongodb_service.create_model(model_info)
        print(f"Created model in MongoDB with ID: {model_db_id}")
        
        # Start training in background
        background_tasks.add_task(run_training, session_id, params)
        
        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "status": "preparing",
            "message": "Training session started",
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"Failed to start training: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")


@router.get("/status/{session_id}")
async def get_local_training_status(session_id: str):
    """Get the status of a local training session"""
    try:
        # Get session from MongoDB instead of local storage
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        # Convert all data to JSON-serializable format
        response_data = {
            "success": True,
            "status": session.get('status', 'unknown'),
            "progress": convert_to_serializable(session.get('progress', {})),
            "epochMetrics": convert_to_serializable(session.get('epochMetrics', [])),
            "result": convert_to_serializable(session.get('result')),
            "error": session.get('error')
        }
        
        return JSONResponse(content=response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Failed to get training status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get training status: {str(e)}")


@router.post("/pause/{session_id}")
async def pause_local_training(session_id: str):
    """Pause a local training session"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        if session.get('status') != 'training':
            raise HTTPException(status_code=400, detail=f"Cannot pause session in {session.get('status')} state")
        
        # Update session in MongoDB
        await mongodb_service.update_training_session(session_id, {"status": "paused"})
        
        return JSONResponse(content={"success": True, "status": "paused", "session_id": session_id})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to pause training: {str(e)}")


@router.post("/resume/{session_id}")
async def resume_local_training(session_id: str):
    """Resume a local training session"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        if session.get('status') != 'paused':
            raise HTTPException(status_code=400, detail=f"Cannot resume session in {session.get('status')} state")
        
        # Update session in MongoDB
        await mongodb_service.update_training_session(session_id, {"status": "training"})
        
        return JSONResponse(content={"success": True, "status": "resumed", "session_id": session_id})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resume training: {str(e)}")


@router.post("/stop/{session_id}")
async def stop_local_training(session_id: str):
    """Stop a local training session"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        if session.get('status') in ['completed', 'failed', 'stopped']:
            raise HTTPException(status_code=400, detail=f"Session already in terminal state: {session.get('status')}")
        
        # Update session in MongoDB
        await mongodb_service.update_training_session(
            session_id, 
            {
                "status": "stopped",
                "error": "Training stopped by user",
                "end_time": datetime.utcnow()
            }
        )
        
        return JSONResponse(content={"success": True, "status": "stopped", "session_id": session_id})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop training: {str(e)}")


@router.post("/upload-gradients/{session_id}")
async def upload_gradients(session_id: str):
    """Upload training gradients"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        if not session.get('result'):
            raise HTTPException(status_code=400, detail="Training not completed yet")
        
        # Mock CID for demo
        mock_cid = f"0x{''.join([f'{i:02x}' for i in range(16)])}"
        
        return JSONResponse(content={
            "success": True,
            "status": "uploaded",
            "cid": mock_cid,
            "url": f"https://walrus.example.com/{mock_cid}"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload gradients: {str(e)}")