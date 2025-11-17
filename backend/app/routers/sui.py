"""
Sui blockchain operation routes for Sui-DAT backend.
Endpoints to interact with the Sui smart contract.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.sui_service import SuiService

router = APIRouter()

class SubmitGradientRequest(BaseModel):
    model_id: str
    gradient_uri: str
    contributor_id: str

class UpdateModelRequest(BaseModel):
    model_id: str
    weights_uri: str
    contributor_count: int

@router.post("/submit-gradient")
async def submit_gradient(request: SubmitGradientRequest):
    """
    Submit a gradient to the Sui smart contract.
    
    Args:
        request: Gradient submission details
    
    Returns:
        Transaction hash
    """
    try:
        sui_service = SuiService()
        tx_hash = await sui_service.submit_gradient(
            request.model_id,
            request.gradient_uri,
            request.contributor_id
        )
        return {"transaction_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit gradient: {str(e)}")

@router.post("/update-model")
async def update_model(request: UpdateModelRequest):
    """
    Update a model version on the Sui smart contract.
    
    Args:
        request: Model update details
    
    Returns:
        Transaction hash
    """
    try:
        sui_service = SuiService()
        tx_hash = await sui_service.update_model_version(
            request.model_id,
            request.weights_uri,
            request.contributor_count
        )
        return {"transaction_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update model: {str(e)}")

@router.get("/model-info/{model_id}")
async def get_model_info(model_id: str):
    """
    Get model information from the Sui smart contract.
    
    Args:
        model_id: Identifier of the model
    
    Returns:
        Model information
    """
    try:
        sui_service = SuiService()
        model_info = await sui_service.get_model_info(model_id)
        return model_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model info: {str(e)}")