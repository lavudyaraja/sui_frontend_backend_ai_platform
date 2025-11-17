"""
Database service for Sui-DAT backend.
Handles database operations for models, gradients, and contributors.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from app.database.models import ModelInfo, GradientSubmission, Contributor, TrainingSession, Dataset

class DatabaseService:
    """Service for database operations."""
    
    def __init__(self):
        """Initialize database service."""
        self.models = []
        self.gradients = []
        self.contributors = []
        self.training_sessions = []
        self.datasets = []
    
    def create_model(self, model_info: ModelInfo) -> str:
        """Create a new model in the database."""
        try:
            # For demo purposes, we'll just store in memory
            model_id = f"model_{len(self.models) + 1}"
            model_dict = model_info.dict()
            model_dict["id"] = model_id
            self.models.append(model_dict)
            return model_id
        except Exception as e:
            print(f"Failed to create model: {e}")
            raise
    
    def get_model(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Get a model by ID."""
        try:
            for model in self.models:
                if model.get("id") == model_id:
                    return model
            return None
        except Exception as e:
            print(f"Failed to get model: {e}")
            return None
    
    def update_model(self, model_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a model."""
        try:
            for model in self.models:
                if model.get("id") == model_id:
                    model.update(update_data)
                    model["updated_at"] = datetime.utcnow()
                    return True
            return False
        except Exception as e:
            print(f"Failed to update model: {e}")
            return False
    
    def submit_gradient(self, gradient: GradientSubmission) -> str:
        """Submit a gradient to the database."""
        try:
            gradient_id = f"gradient_{len(self.gradients) + 1}"
            gradient_dict = gradient.dict()
            gradient_dict["id"] = gradient_id
            self.gradients.append(gradient_dict)
            return gradient_id
        except Exception as e:
            print(f"Failed to submit gradient: {e}")
            raise
    
    def get_gradients(self, model_id: str) -> List[Dict[str, Any]]:
        """Get all gradients for a model."""
        try:
            result = []
            for gradient in self.gradients:
                if gradient.get("model_id") == model_id:
                    result.append(gradient)
            return result
        except Exception as e:
            print(f"Failed to get gradients: {e}")
            return []
    
    def create_contributor(self, contributor: Contributor) -> str:
        """Create a new contributor."""
        try:
            contributor_id = f"contributor_{len(self.contributors) + 1}"
            contributor_dict = contributor.dict()
            contributor_dict["id"] = contributor_id
            self.contributors.append(contributor_dict)
            return contributor_id
        except Exception as e:
            print(f"Failed to create contributor: {e}")
            raise
    
    def get_contributor(self, contributor_id: str) -> Optional[Dict[str, Any]]:
        """Get a contributor by ID."""
        try:
            for contributor in self.contributors:
                if contributor.get("id") == contributor_id:
                    return contributor
            return None
        except Exception as e:
            print(f"Failed to get contributor: {e}")
            return None
    
    def update_contributor_reputation(self, contributor_id: str, score_delta: float) -> bool:
        """Update contributor reputation score."""
        try:
            for contributor in self.contributors:
                if contributor.get("id") == contributor_id:
                    contributor["reputation_score"] = contributor.get("reputation_score", 0) + score_delta
                    contributor["total_contributions"] = contributor.get("total_contributions", 0) + 1
                    contributor["last_contribution"] = datetime.utcnow()
                    return True
            return False
        except Exception as e:
            print(f"Failed to update contributor reputation: {e}")
            return False
    
    def create_training_session(self, session: TrainingSession) -> str:
        """Create a new training session."""
        try:
            session_id = f"session_{len(self.training_sessions) + 1}"
            session_dict = session.dict()
            session_dict["id"] = session_id
            self.training_sessions.append(session_dict)
            return session_id
        except Exception as e:
            print(f"Failed to create training session: {e}")
            raise
    
    def update_training_session(self, session_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a training session."""
        try:
            for session in self.training_sessions:
                if session.get("id") == session_id:
                    session.update(update_data)
                    if "status" in update_data:
                        session["end_time"] = datetime.utcnow()
                    return True
            return False
        except Exception as e:
            print(f"Failed to update training session: {e}")
            return False
    
    def create_dataset(self, dataset: Dataset) -> str:
        """Create a new dataset entry in the database."""
        try:
            dataset_id = f"dataset_{len(self.datasets) + 1}"
            dataset_dict = dataset.dict()
            dataset_dict["id"] = dataset_id
            self.datasets.append(dataset_dict)
            return dataset_id
        except Exception as e:
            print(f"Failed to create dataset: {e}")
            raise
    
    def get_dataset(self, dataset_id: str) -> Optional[Dict[str, Any]]:
        """Get a dataset by ID."""
        try:
            for dataset in self.datasets:
                if dataset.get("id") == dataset_id:
                    return dataset
            return None
        except Exception as e:
            print(f"Failed to get dataset: {e}")
            return None
    
    def get_datasets_by_contributor(self, contributor_id: str) -> List[Dict[str, Any]]:
        """Get all datasets uploaded by a contributor."""
        try:
            result = []
            for dataset in self.datasets:
                if dataset.get("uploaded_by") == contributor_id:
                    result.append(dataset)
            return result
        except Exception as e:
            print(f"Failed to get datasets by contributor: {e}")
            return []