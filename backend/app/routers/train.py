"""
Training trigger routes for Sui-DAT backend.
Proxies requests to local training endpoints for compatibility.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uuid
from datetime import datetime

# Import local training router's functions
from app.routers.local_training import (
    run_training, 
    convert_to_serializable
)

# Import MongoDB service
from app.services.mongodb_service import MongoDBService
from app.database.models import TrainingSession, ModelInfo, GradientSubmission

router = APIRouter()

# Initialize MongoDB service
mongodb_service = MongoDBService()

class TrainingRequest(BaseModel):
    model_type: str = "mlp"
    epochs: int = 10
    batch_size: int = 32
    learning_rate: float = 0.001
    dataset_cid: Optional[str] = None
    optimizer: Optional[str] = "adam"
    validation_split: Optional[float] = 0.2


@router.post("/start-with-dataset")
async def start_training_with_dataset(
    file: UploadFile = File(...),
    model_type: str = Form("mlp"),
    epochs: int = Form(10),
    batch_size: int = Form(32),
    learning_rate: float = Form(0.001),
    optimizer: str = Form("adam"),
    validation_split: float = Form(0.2),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """Start a new training process with dataset file upload"""
    try:
        session_id = str(uuid.uuid4())
        
        # For demo purposes, we'll just log that we received the file
        # In a real implementation, you would process the file and store it
        print(f"Received file: {file.filename} size: {file.size} type: {file.content_type}")
        
        # Store session parameters
        params = {
            "model_type": model_type,
            "epochs": epochs,
            "batch_size": batch_size,
            "learning_rate": learning_rate,
            "dataset_cid": f"mock_cid_for_{file.filename}",  # Mock CID for demo
            "optimizer": optimizer,
            "validation_split": validation_split
        }
        
        # Create training session in MongoDB
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
        model_info = ModelInfo(
            id=f"model_{session_id[:8]}",
            name=f"Model {session_id[:8]}",
            description=f"Neural network model trained with {model_type}",
            version="1.0.0",
            accuracy=0.0
        )
        model_db_id = await mongodb_service.create_model(model_info)
        print(f"Created model in MongoDB with ID: {model_db_id}")
        
        # Start training in background
        background_tasks.add_task(run_training, session_id, params)
        
        print(f"✅ Training session started: {session_id}")
        
        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "dataset_cid": f"mock_cid_for_{file.filename}",
            "status": "preparing",
            "message": "Training session started",
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Failed to start training: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")


@router.post("/start")
async def start_training(request: TrainingRequest, background_tasks: BackgroundTasks):
    """Start a new training process (proxies to local training)"""
    try:
        session_id = str(uuid.uuid4())
        
        # Store session parameters
        params = {
            "model_type": request.model_type,
            "epochs": request.epochs,
            "batch_size": request.batch_size,
            "learning_rate": request.learning_rate,
            "dataset_cid": request.dataset_cid,
            "optimizer": request.optimizer,
            "validation_split": request.validation_split
        }
        
        # Create training session in MongoDB
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
        model_info = ModelInfo(
            id=f"model_{session_id[:8]}",
            name=f"Model {session_id[:8]}",
            description=f"Neural network model trained with {request.model_type}",
            version="1.0.0",
            accuracy=0.0
        )
        model_db_id = await mongodb_service.create_model(model_info)
        print(f"Created model in MongoDB with ID: {model_db_id}")
        
        # Start training in background
        background_tasks.add_task(run_training, session_id, params)
        
        print(f"✅ Training session started: {session_id}")
        
        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "status": "preparing",
            "message": "Training session started",
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Failed to start training: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")


@router.get("/status/{session_id}")
async def get_training_status(session_id: str):
    """Get the status of a training session"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            print(f"❌ Session not found: {session_id}")
            raise HTTPException(status_code=404, detail="Training session not found")
        
        print(f"Getting status for session: {session_id} - Status: {session.get('status')}")
        
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
        print(f"❌ Failed to get training status: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to get training status: {str(e)}")


@router.post("/pause/{session_id}")
async def pause_training(session_id: str):
    """Pause a training session"""
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
async def resume_training(session_id: str):
    """Resume a training session"""
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
async def stop_training(session_id: str):
    """Stop a training session"""
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


@router.get("/model/{model_id}")
async def get_training_model_info(model_id: str):
    """Get model information for training"""
    try:
        # Try to get model from MongoDB
        model = await mongodb_service.get_model(model_id)
        if model:
            return JSONResponse(content={
                "success": True,
                "model": model
            })
        
        # If not found, return default model info
        return JSONResponse(content={
            "success": True,
            "model": {
                "id": model_id,
                "name": f"Model {model_id}",
                "description": "Neural network model for decentralized training",
                "version": "1.0.0",
                "accuracy": 92.5,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model info: {str(e)}")


@router.get("/model-details/{model_id}")
async def get_model_details(model_id: str):
    """Get comprehensive model details including training history and metrics"""
    try:
        # Get model info from MongoDB
        model = await mongodb_service.get_model(model_id)
        if not model:
            # Try with prefix if not found
            model = await mongodb_service.get_model(f"model_{model_id}")
        
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        
        # Get all training sessions for this model
        training_sessions = await mongodb_service.list_training_sessions(model.get("id", model_id))
        
        # Get all gradients for this model
        gradients = await mongodb_service.get_gradients(model.get("id", model_id))
        
        return JSONResponse(content={
            "success": True,
            "model": model,
            "training_history": training_sessions,
            "gradients": gradients
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model details: {str(e)}")


@router.get("/sessions")
async def list_training_sessions():
    """List all training sessions"""
    try:
        sessions = await mongodb_service.list_training_sessions()
        return JSONResponse(content={
            "success": True,
            "sessions": sessions
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list training sessions: {str(e)}")


@router.get("/session/{session_id}")
async def get_training_session_details(session_id: str):
    """Get detailed information about a specific training session"""
    try:
        # Get session from MongoDB
        db_session = await mongodb_service.get_training_session(session_id)
        if db_session:
            return JSONResponse(content={
                "success": True,
                "session": db_session
            })
        
        raise HTTPException(status_code=404, detail="Training session not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get training session: {str(e)}")


@router.post("/submit-gradients/{session_id}")
async def submit_gradients(session_id: str, gradients: dict):
    """Submit training gradients to MongoDB"""
    try:
        # Get session from MongoDB
        session = await mongodb_service.get_training_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Training session not found")
        
        if not session.get('result'):
            raise HTTPException(status_code=400, detail="Training not completed yet")
        
        # Create gradient submission in MongoDB
        gradient_submission = GradientSubmission(
            model_id=session.get("model_id", f"model_{session_id[:8]}"),
            contributor_id="demo_contributor",
            gradient_uri=f"walrus://gradients/{session_id}",
            blob_id=f"blob_{session_id[:8]}",
            size=len(str(gradients)),
            metadata={
                "session_id": session_id,
                "final_accuracy": session.get('result', {}).get('finalAccuracy', 0),
                "final_loss": session.get('result', {}).get('finalLoss', 0)
            }
        )
        
        gradient_id = await mongodb_service.submit_gradient(gradient_submission)
        print(f"Submitted gradients to MongoDB with ID: {gradient_id}")
        
        return JSONResponse(content={
            "success": True,
            "gradient_id": gradient_id,
            "message": "Gradients submitted successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit gradients: {str(e)}")