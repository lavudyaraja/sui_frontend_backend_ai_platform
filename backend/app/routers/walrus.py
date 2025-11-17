"""
Walrus interaction routes for Sui-DAT backend.
Endpoints to interact with Walrus decentralized storage.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.walrus_service import WalrusService

router = APIRouter()

@router.post("/store")
async def store_blob(file: UploadFile = File(...), content_type: str = "application/octet-stream"):
    """
    Store a file in Walrus decentralized storage.
    
    Args:
        file: File to store
        content_type: MIME type of the file
    
    Returns:
        Blob ID and storage information
    """
    try:
        walrus_service = WalrusService()
        content = await file.read()
        blob_id = await walrus_service.store(content, content_type)
        return {
            "status": "stored",
            "blob_id": blob_id,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store blob: {str(e)}")

@router.get("/retrieve/{blob_id}")
async def retrieve_blob(blob_id: str):
    """
    Retrieve a file from Walrus decentralized storage.
    
    Args:
        blob_id: ID of the blob to retrieve
    
    Returns:
        Blob data
    """
    try:
        walrus_service = WalrusService()
        data = await walrus_service.retrieve(blob_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve blob: {str(e)}")

@router.head("/exists/{blob_id}")
async def check_blob_exists(blob_id: str):
    """
    Check if a blob exists in Walrus storage.
    
    Args:
        blob_id: ID of the blob to check
    
    Returns:
        Boolean indicating existence
    """
    try:
        walrus_service = WalrusService()
        exists = await walrus_service.exists(blob_id)
        return {"blob_id": blob_id, "exists": exists}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check blob existence: {str(e)}")