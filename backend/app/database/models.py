"""
Database models for Sui-DAT backend.
Defines data models for MongoDB collections.
"""

from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class ModelInfo(BaseModel):
    """Model information stored in database."""
    id: Optional[str] = None
    name: str
    description: str
    version: str
    accuracy: float
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class GradientSubmission(BaseModel):
    """Gradient submission stored in database."""
    id: Optional[str] = None
    model_id: str
    contributor_id: str
    gradient_uri: str
    blob_id: str
    size: int
    timestamp: datetime = datetime.utcnow()
    metadata: Optional[Dict[str, Any]] = None

class Contributor(BaseModel):
    """Contributor information stored in database."""
    id: Optional[str] = None
    address: str
    reputation_score: float
    total_contributions: int
    successful_contributions: int
    last_contribution: datetime = datetime.utcnow()
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class TrainingSession(BaseModel):
    """Training session information stored in database."""
    id: Optional[str] = None
    model_id: str
    contributor_id: str
    status: str  # started, completed, failed
    start_time: datetime = datetime.utcnow()
    end_time: Optional[datetime] = None
    metrics: Optional[Dict[str, Any]] = None
    gradient_uri: Optional[str] = None

class Dataset(BaseModel):
    """Dataset information stored in database."""
    id: Optional[str] = None
    filename: str
    size: int
    cid: str
    validation: Dict[str, Any]
    uploaded_by: str
    uploaded_at: datetime = datetime.utcnow()
    content_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None