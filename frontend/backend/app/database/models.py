"""
Database models for MongoDB
"""

from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime


class TrainingSession(BaseModel):
    """Training session model"""
    id: str
    model_id: str
    contributor_id: str = "demo_contributor"
    status: str = "preparing"  # preparing, training, paused, completed, failed, stopped
    metrics: Dict[str, Any] = {}
    progress: Dict[str, Any] = {}
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    epoch_metrics: List[Dict[str, Any]] = []

