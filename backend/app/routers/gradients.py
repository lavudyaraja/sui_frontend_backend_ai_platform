"""
Gradient upload/download routes for Sui-DAT backend.
Endpoints to handle gradient data exchange.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import List
from app.services.gradient_service import GradientService
from app.dependencies import get_db

router = APIRouter()

@router.post("/upload")
async def upload_gradient(
    model_id: str = Form(...),
    contributor_id: str = Form(...),
    gradient_file: UploadFile = File(...),
    db = Depends(get_db)
):
    """
    Upload a gradient file for a model.
    
    Args:
        model_id: Identifier of the model
        contributor_id: Identifier of the contributor
        gradient_file: Gradient data file
    
    Returns:
        Upload confirmation with URI
    """
    try:
        gradient_service = GradientService(db)
        content = await gradient_file.read()
        uri = await gradient_service.store_gradient(model_id, contributor_id, content)
        return {
            "status": "uploaded",
            "uri": uri,
            "model_id": model_id,
            "contributor_id": contributor_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload gradient: {str(e)}")

@router.get("/download/{gradient_uri}")
async def download_gradient(gradient_uri: str, db = Depends(get_db)):
    """
    Download a gradient file by URI.
    
    Args:
        gradient_uri: URI of the gradient to download
    
    Returns:
        Gradient data
    """
    try:
        gradient_service = GradientService(db)
        gradient_data = await gradient_service.retrieve_gradient(gradient_uri)
        if not gradient_data:
            raise HTTPException(status_code=404, detail="Gradient not found")
        return gradient_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download gradient: {str(e)}")

@router.get("/list/{model_id}")
async def list_gradients(model_id: str, db = Depends(get_db)):
    """
    List all gradients for a model.
    
    Args:
        model_id: Identifier of the model
    
    Returns:
        List of gradient URIs
    """
    try:
        gradient_service = GradientService(db)
        gradients = await gradient_service.list_gradients(model_id)
        return {"model_id": model_id, "gradients": gradients}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list gradients: {str(e)}")