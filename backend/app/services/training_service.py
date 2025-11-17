"""
Training service for Sui-DAT backend.
Coordinates distributed training sessions.
"""

from typing import Dict, Any, Optional 
import asyncio
import uuid
from datetime import datetime
from app.ai.trainer import Trainer


class TrainingService:
    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.session_locks: Dict[str, asyncio.Lock] = {}
    
    async def start_training(self, model_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Start a new training session.
        
        Args:
            model_id: Identifier of the model to train
            params: Training parameters
            
        Returns:
            Training session information
        """
        session_id = str(uuid.uuid4())
        
        # Initialize trainer
        trainer = Trainer(model_id, params)
        
        # Store session
        self.active_sessions[session_id] = {
            "session_id": session_id,
            "model_id": model_id,
            "trainer": trainer,
            "params": params,
            "status": "preparing",
            "start_time": datetime.utcnow(),
            "participants": [],
            "gradients": [],
            "progress": {
                "epoch": 0,
                "batch": 0,
                "totalBatches": 0,
                "loss": 0.0,
                "accuracy": 0.0,
                "percentage": 0.0,
                "timeElapsed": 0,
                "estimatedTimeRemaining": 0
            },
            "epochMetrics": [],
            "logs": []
        }
        
        self.session_locks[session_id] = asyncio.Lock()
        
        # Add initial log
        self.active_sessions[session_id]["logs"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "level": "info",
            "message": f"Training session {session_id} initialized"
        })
        
        # If dataset CID is provided, start training
        if "dataset_cid" in params:
            print(f"Starting training session {session_id} with dataset {params['dataset_cid']}")
            self.active_sessions[session_id]["status"] = "training"
            self.active_sessions[session_id]["logs"].append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": "info",
                "message": f"Using dataset: {params['dataset_cid']}"
            })
        
        return {
            "session_id": session_id,
            "model_id": model_id,
            "timestamp": datetime.utcnow().isoformat(),
            "status": self.active_sessions[session_id]["status"]
        }
    
    async def get_training_status(self, session_id: str) -> Dict[str, Any]:
        """
        Get the status of a training session.
        
        Args:
            session_id: Training session identifier
            
        Returns:
            Training session status (JSON-serializable)
        """
        if session_id not in self.active_sessions:
            raise ValueError("Training session not found")
        
        session = self.active_sessions[session_id]
        
        # Calculate duration
        duration = (datetime.utcnow() - session["start_time"]).total_seconds()
        
        # Convert to JSON-serializable format
        return {
            "success": True,
            "session_id": session_id,
            "model_id": session["model_id"],
            "status": session["status"],
            "participants": len(session["participants"]),
            "start_time": session["start_time"].isoformat(),
            "duration": float(duration),
            "progress": session.get("progress", {}),
            "epochMetrics": session.get("epochMetrics", []),
            "logs": session.get("logs", []),
            "result": session.get("result")
        }
    
    async def update_progress(self, session_id: str, progress: Dict[str, Any]):
        """Update training progress for a session"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["progress"] = progress
    
    async def add_epoch_metric(self, session_id: str, metric: Dict[str, Any]):
        """Add epoch metric for a session"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["epochMetrics"].append(metric)
    
    async def add_log(self, session_id: str, level: str, message: str):
        """Add log entry for a session"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["logs"].append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": level,
                "message": message
            })
    
    async def complete_training(self, session_id: str, result: Dict[str, Any]):
        """Mark training as completed and store result"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["status"] = "completed"
            self.active_sessions[session_id]["result"] = result
            self.active_sessions[session_id]["end_time"] = datetime.utcnow()
    
    async def fail_training(self, session_id: str, error: str):
        """Mark training as failed"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["status"] = "failed"
            self.active_sessions[session_id]["error"] = error
            self.active_sessions[session_id]["end_time"] = datetime.utcnow()
    
    async def stop_training(self, session_id: str):
        """
        Stop a training session.
        
        Args:
            session_id: Training session identifier
        """
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["status"] = "stopped"
            self.active_sessions[session_id]["end_time"] = datetime.utcnow()
            
            # Add log
            self.active_sessions[session_id]["logs"].append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": "warning",
                "message": "Training stopped by user"
            })
    
    async def pause_training(self, session_id: str):
        """Pause a training session"""
        if session_id in self.active_sessions:
            if self.active_sessions[session_id]["status"] == "training":
                self.active_sessions[session_id]["status"] = "paused"
                self.active_sessions[session_id]["logs"].append({
                    "timestamp": datetime.utcnow().isoformat(),
                    "level": "warning",
                    "message": "Training paused by user"
                })
    
    async def resume_training(self, session_id: str):
        """Resume a paused training session"""
        if session_id in self.active_sessions:
            if self.active_sessions[session_id]["status"] == "paused":
                self.active_sessions[session_id]["status"] = "training"
                self.active_sessions[session_id]["logs"].append({
                    "timestamp": datetime.utcnow().isoformat(),
                    "level": "info",
                    "message": "Training resumed by user"
                })
    
    async def get_model_info(self, model_id: str) -> Dict[str, Any]:
        """Get model information"""
        return {
            "model_id": model_id,
            "name": f"Model {model_id}",
            "description": "Neural network model for decentralized training",
            "current_version": "1.0.0",
            "created_at": "2023-01-01T00:00:00Z",
            "updated_at": datetime.utcnow().isoformat(),
            "accuracy": 92.5
        }
    
    async def add_participant(self, session_id: str, participant_id: str) -> bool:
        """Add a participant to a training session"""
        if session_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[session_id]
        if participant_id not in session["participants"]:
            session["participants"].append(participant_id)
        return True
    
    async def submit_gradient(self, session_id: str, participant_id: str, gradient_data: Dict[str, Any]) -> bool:
        """Submit a gradient to a training session"""
        if session_id not in self.active_sessions:
            return False
        
        async with self.session_locks[session_id]:
            session = self.active_sessions[session_id]
            session["gradients"].append({
                "participant_id": participant_id,
                "gradient_data": gradient_data,
                "timestamp": datetime.utcnow()
            })
            
            # If we have enough gradients, perform aggregation
            threshold = session["params"].get("aggregation_threshold", 3)
            if len(session["gradients"]) >= threshold:
                await self._aggregate_gradients(session_id)
            
            return True
    
    async def _aggregate_gradients(self, session_id: str):
        """Aggregate gradients and update model"""
        session = self.active_sessions[session_id]
        
        # Extract gradient data
        gradients_list = [g["gradient_data"] for g in session["gradients"]]
        
        # Simple federated averaging
        if gradients_list:
            averaged_gradients = {}
            for key in gradients_list[0].keys():
                averaged_gradients[key] = sum(g[key] for g in gradients_list) / len(gradients_list)
            
            # Update model
            trainer = session["trainer"]
            trainer.apply_gradients(averaged_gradients)
            
            # Clear gradients for next round
            session["gradients"] = []
            
            print(f"Aggregated gradients for session {session_id} from {len(gradients_list)} participants")