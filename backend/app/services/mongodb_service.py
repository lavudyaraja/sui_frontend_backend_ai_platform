"""
MongoDB service for Sui-DAT backend.
Handles database operations with actual MongoDB integration.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database.mongo import get_collection
from app.database.models import (
    ModelInfo, GradientSubmission, Contributor, 
    TrainingSession, Dataset
)

class MongoDBService:
    """Service for MongoDB operations."""
    
    def __init__(self):
        """Initialize MongoDB service."""
        pass
    
    async def create_model(self, model_info: ModelInfo) -> str:
        """Create a new model in MongoDB."""
        try:
            collection = get_collection("models")
            model_dict = model_info.dict()
            # Remove id if it's None to let MongoDB generate it
            if model_dict.get("id") is None:
                model_dict.pop("id", None)
            
            result = await collection.insert_one(model_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to create model in MongoDB: {e}")
            raise
    
    async def get_model(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Get a model by ID from MongoDB."""
        try:
            collection = get_collection("models")
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(model_id)
                model = await collection.find_one({"_id": obj_id})
            except:
                # If not a valid ObjectId, search by string id
                model = await collection.find_one({"id": model_id})
                if not model:
                    # Also try searching by _id as string
                    model = await collection.find_one({"_id": model_id})
            
            if model:
                # Convert ObjectId to string for JSON serialization
                if "_id" in model:
                    model["id"] = str(model["_id"])
                    del model["_id"]
            return model
        except Exception as e:
            print(f"Failed to get model from MongoDB: {e}")
            return None
    
    async def update_model(self, model_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a model in MongoDB."""
        try:
            collection = get_collection("models")
            # Remove id from update data to prevent overwriting
            update_data.pop("id", None)
            update_data["updated_at"] = datetime.utcnow()
            
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(model_id)
                result = await collection.update_one(
                    {"_id": obj_id},
                    {"$set": update_data}
                )
            except:
                # If not a valid ObjectId, search by string id
                result = await collection.update_one(
                    {"id": model_id},
                    {"$set": update_data}
                )
                if result.matched_count == 0:
                    # Also try searching by _id as string
                    result = await collection.update_one(
                        {"_id": model_id},
                        {"$set": update_data}
                    )
            
            return result.modified_count > 0
        except Exception as e:
            print(f"Failed to update model in MongoDB: {e}")
            return False
    
    async def list_models(self) -> List[Dict[str, Any]]:
        """List all models from MongoDB."""
        try:
            collection = get_collection("models")
            cursor = collection.find({})
            models = []
            async for model in cursor:
                if "_id" in model:
                    model["id"] = str(model["_id"])
                    del model["_id"]
                models.append(model)
            return models
        except Exception as e:
            print(f"Failed to list models from MongoDB: {e}")
            return []
    
    async def submit_gradient(self, gradient: GradientSubmission) -> str:
        """Submit a gradient to MongoDB."""
        try:
            collection = get_collection("gradients")
            gradient_dict = gradient.dict()
            # Remove id if it's None to let MongoDB generate it
            if gradient_dict.get("id") is None:
                gradient_dict.pop("id", None)
            
            result = await collection.insert_one(gradient_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to submit gradient to MongoDB: {e}")
            raise
    
    async def get_gradients(self, model_id: str) -> List[Dict[str, Any]]:
        """Get all gradients for a model from MongoDB."""
        try:
            collection = get_collection("gradients")
            cursor = collection.find({"model_id": model_id})
            gradients = []
            async for gradient in cursor:
                if "_id" in gradient:
                    gradient["id"] = str(gradient["_id"])
                    del gradient["_id"]
                gradients.append(gradient)
            return gradients
        except Exception as e:
            print(f"Failed to get gradients from MongoDB: {e}")
            return []
    
    async def get_gradient(self, gradient_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific gradient by ID from MongoDB."""
        try:
            collection = get_collection("gradients")
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(gradient_id)
                gradient = await collection.find_one({"_id": obj_id})
            except:
                # If not a valid ObjectId, search by string id
                gradient = await collection.find_one({"id": gradient_id})
                if not gradient:
                    # Also try searching by _id as string
                    gradient = await collection.find_one({"_id": gradient_id})
            
            if gradient:
                # Convert ObjectId to string for JSON serialization
                if "_id" in gradient:
                    gradient["id"] = str(gradient["_id"])
                    del gradient["_id"]
            return gradient
        except Exception as e:
            print(f"Failed to get gradient from MongoDB: {e}")
            return None
    
    async def create_contributor(self, contributor: Contributor) -> str:
        """Create a new contributor in MongoDB."""
        try:
            collection = get_collection("contributors")
            contributor_dict = contributor.dict()
            # Remove id if it's None to let MongoDB generate it
            if contributor_dict.get("id") is None:
                contributor_dict.pop("id", None)
            
            result = await collection.insert_one(contributor_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to create contributor in MongoDB: {e}")
            raise
    
    async def get_contributor(self, contributor_id: str) -> Optional[Dict[str, Any]]:
        """Get a contributor by ID from MongoDB."""
        try:
            collection = get_collection("contributors")
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(contributor_id)
                contributor = await collection.find_one({"_id": obj_id})
            except:
                # If not a valid ObjectId, search by string id
                contributor = await collection.find_one({"id": contributor_id})
                if not contributor:
                    # Also try searching by _id as string
                    contributor = await collection.find_one({"_id": contributor_id})
            
            if contributor:
                # Convert ObjectId to string for JSON serialization
                if "_id" in contributor:
                    contributor["id"] = str(contributor["_id"])
                    del contributor["_id"]
            return contributor
        except Exception as e:
            print(f"Failed to get contributor from MongoDB: {e}")
            return None
    
    async def update_contributor_reputation(self, contributor_id: str, score_delta: float) -> bool:
        """Update contributor reputation score in MongoDB."""
        try:
            collection = get_collection("contributors")
            update_data = {
                "$inc": {
                    "reputation_score": score_delta,
                    "total_contributions": 1
                },
                "$set": {
                    "last_contribution": datetime.utcnow()
                }
            }
            
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(contributor_id)
                result = await collection.update_one(
                    {"_id": obj_id},
                    update_data
                )
            except:
                # If not a valid ObjectId, search by string id
                result = await collection.update_one(
                    {"id": contributor_id},
                    update_data
                )
                if result.matched_count == 0:
                    # Also try searching by _id as string
                    result = await collection.update_one(
                        {"_id": contributor_id},
                        update_data
                    )
            
            return result.modified_count > 0
        except Exception as e:
            print(f"Failed to update contributor reputation in MongoDB: {e}")
            return False
    
    async def create_training_session(self, session: TrainingSession) -> str:
        """Create a new training session in MongoDB."""
        try:
            collection = get_collection("training_sessions")
            session_dict = session.dict()
            # Remove id if it's None to let MongoDB generate it
            if session_dict.get("id") is None:
                session_dict.pop("id", None)
            
            # Convert datetime objects to ISO format strings for storage
            if "start_time" in session_dict and isinstance(session_dict["start_time"], datetime):
                session_dict["start_time"] = session_dict["start_time"].isoformat()
            if "end_time" in session_dict and isinstance(session_dict["end_time"], datetime):
                session_dict["end_time"] = session_dict["end_time"].isoformat()
            if "timestamp" in session_dict and isinstance(session_dict["timestamp"], datetime):
                session_dict["timestamp"] = session_dict["timestamp"].isoformat()
            
            result = await collection.insert_one(session_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to create training session in MongoDB: {e}")
            raise
    
    async def get_training_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get a training session by ID from MongoDB."""
        try:
            collection = get_collection("training_sessions")
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(session_id)
                session = await collection.find_one({"_id": obj_id})
            except:
                # If not a valid ObjectId, search by string id
                session = await collection.find_one({"id": session_id})
                if not session:
                    # Also try searching by _id as string
                    session = await collection.find_one({"_id": session_id})
            
            if session:
                # Convert ObjectId to string for JSON serialization
                if "_id" in session:
                    session["id"] = str(session["_id"])
                    del session["_id"]
                
                # Convert ISO format strings back to datetime objects if needed
                if "start_time" in session and isinstance(session["start_time"], str):
                    try:
                        session["start_time"] = datetime.fromisoformat(session["start_time"])
                    except (ValueError, TypeError):
                        pass  # Keep as string if conversion fails
                if "end_time" in session and isinstance(session["end_time"], str):
                    try:
                        session["end_time"] = datetime.fromisoformat(session["end_time"])
                    except (ValueError, TypeError):
                        pass  # Keep as string if conversion fails
            return session
        except Exception as e:
            print(f"Failed to get training session from MongoDB: {e}")
            return None
    
    async def update_training_session(self, session_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a training session in MongoDB."""
        try:
            collection = get_collection("training_sessions")
            # Remove id from update data to prevent overwriting
            update_data.pop("id", None)
            
            # If status is being updated to a terminal state, set end_time
            if "status" in update_data and update_data["status"] in ["completed", "failed", "stopped"]:
                update_data["end_time"] = datetime.utcnow()
            
            # Convert datetime objects to ISO format strings for storage
            if "start_time" in update_data and isinstance(update_data["start_time"], datetime):
                update_data["start_time"] = update_data["start_time"].isoformat()
            if "end_time" in update_data and isinstance(update_data["end_time"], datetime):
                update_data["end_time"] = update_data["end_time"].isoformat()
            
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(session_id)
                result = await collection.update_one(
                    {"_id": obj_id},
                    {"$set": update_data}
                )
            except:
                # If not a valid ObjectId, search by string id
                result = await collection.update_one(
                    {"id": session_id},
                    {"$set": update_data}
                )
                if result.matched_count == 0:
                    # Also try searching by _id as string
                    result = await collection.update_one(
                        {"_id": session_id},
                        {"$set": update_data}
                    )
            
            return result.modified_count > 0
        except Exception as e:
            print(f"Failed to update training session in MongoDB: {e}")
            return False
    
    async def list_training_sessions(self, model_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """List training sessions from MongoDB, optionally filtered by model_id."""
        try:
            collection = get_collection("training_sessions")
            filter_query = {}
            if model_id:
                filter_query["model_id"] = model_id
                
            cursor = collection.find(filter_query)
            sessions = []
            async for session in cursor:
                if "_id" in session:
                    session["id"] = str(session["_id"])
                    del session["_id"]
                sessions.append(session)
            return sessions
        except Exception as e:
            print(f"Failed to list training sessions from MongoDB: {e}")
            return []
    
    async def create_dataset(self, dataset: Dataset) -> str:
        """Create a new dataset entry in MongoDB."""
        try:
            collection = get_collection("datasets")
            dataset_dict = dataset.dict()
            # Remove id if it's None to let MongoDB generate it
            if dataset_dict.get("id") is None:
                dataset_dict.pop("id", None)
            
            result = await collection.insert_one(dataset_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to create dataset in MongoDB: {e}")
            raise
    
    async def get_dataset(self, dataset_id: str) -> Optional[Dict[str, Any]]:
        """Get a dataset by ID from MongoDB."""
        try:
            collection = get_collection("datasets")
            # Try to convert string ID to ObjectId
            try:
                obj_id = ObjectId(dataset_id)
                dataset = await collection.find_one({"_id": obj_id})
            except:
                # If not a valid ObjectId, search by string id
                dataset = await collection.find_one({"id": dataset_id})
                if not dataset:
                    # Also try searching by _id as string
                    dataset = await collection.find_one({"_id": dataset_id})
            
            if dataset:
                # Convert ObjectId to string for JSON serialization
                if "_id" in dataset:
                    dataset["id"] = str(dataset["_id"])
                    del dataset["_id"]
            return dataset
        except Exception as e:
            print(f"Failed to get dataset from MongoDB: {e}")
            return None
    
    async def get_datasets_by_contributor(self, contributor_id: str) -> List[Dict[str, Any]]:
        """Get all datasets uploaded by a contributor from MongoDB."""
        try:
            collection = get_collection("datasets")
            cursor = collection.find({"uploaded_by": contributor_id})
            datasets = []
            async for dataset in cursor:
                if "_id" in dataset:
                    dataset["id"] = str(dataset["_id"])
                    del dataset["_id"]
                datasets.append(dataset)
            return datasets
        except Exception as e:
            print(f"Failed to get datasets by contributor from MongoDB: {e}")
            return []
    
    async def list_datasets(self) -> List[Dict[str, Any]]:
        """List all datasets from MongoDB."""
        try:
            collection = get_collection("datasets")
            cursor = collection.find({})
            datasets = []
            async for dataset in cursor:
                if "_id" in dataset:
                    dataset["id"] = str(dataset["_id"])
                    del dataset["_id"]
                datasets.append(dataset)
            return datasets
        except Exception as e:
            print(f"Failed to list datasets from MongoDB: {e}")
            return []