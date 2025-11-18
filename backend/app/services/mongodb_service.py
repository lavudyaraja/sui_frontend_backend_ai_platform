"""
MongoDB service for database operations
"""

from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database.mongo import get_collection, is_connected
from app.database.models import TrainingSession


class MongoDBService:
    """Service for MongoDB operations"""
    
    def __init__(self):
        pass
    
    def _check_connection(self):
        """Check if MongoDB is connected"""
        if not is_connected():
            raise Exception("MongoDB is not connected")
    
    async def create_training_session(self, session: TrainingSession) -> str:
        """Create a new training session"""
        try:
            self._check_connection()
            collection = get_collection("training_sessions")
            session_dict = session.dict()
            
            # Convert datetime to ISO string
            if session_dict.get("start_time") and isinstance(session_dict["start_time"], datetime):
                session_dict["start_time"] = session_dict["start_time"].isoformat()
            if session_dict.get("end_time") and isinstance(session_dict["end_time"], datetime):
                session_dict["end_time"] = session_dict["end_time"].isoformat()
            
            result = await collection.insert_one(session_dict)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Failed to create training session: {e}")
            raise
    
    async def get_training_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get a training session by ID"""
        try:
            self._check_connection()
            collection = get_collection("training_sessions")
            
            # Try ObjectId first
            try:
                obj_id = ObjectId(session_id)
                session = await collection.find_one({"_id": obj_id})
            except:
                # Try string id
                session = await collection.find_one({"id": session_id})
            
            if session:
                # Convert ObjectId to string
                if "_id" in session:
                    session["id"] = str(session["_id"])
                    del session["_id"]
            return session
        except Exception as e:
            print(f"Failed to get training session: {e}")
            return None
    
    async def update_training_session(self, session_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a training session"""
        try:
            self._check_connection()
            collection = get_collection("training_sessions")
            
            # Convert datetime to ISO string
            if "start_time" in update_data and isinstance(update_data["start_time"], datetime):
                update_data["start_time"] = update_data["start_time"].isoformat()
            if "end_time" in update_data and isinstance(update_data["end_time"], datetime):
                update_data["end_time"] = update_data["end_time"].isoformat()
            
            # Try ObjectId first
            try:
                obj_id = ObjectId(session_id)
                result = await collection.update_one({"_id": obj_id}, {"$set": update_data})
            except:
                # Try string id
                result = await collection.update_one({"id": session_id}, {"$set": update_data})
            
            return result.modified_count > 0
        except Exception as e:
            print(f"Failed to update training session: {e}")
            return False

