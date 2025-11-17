"""
Gradient service for Sui-DAT backend.
Handles parsing, validating, and storing gradients.
"""

from typing import List, Dict, Any
import numpy as np
import json
import uuid
from app.services.walrus_service import WalrusService
from app.ai.gradient_utils import validate_gradients

class GradientService:
    def __init__(self, db):
        self.db = db
        self.walrus_service = WalrusService()
    
    async def store_gradient(self, model_id: str, contributor_id: str, gradient_data: bytes) -> str:
        """
        Store gradient data in Walrus and record in database.
        
        Args:
            model_id: Identifier of the model
            contributor_id: Identifier of the contributor
            gradient_data: Raw gradient data
            
        Returns:
            URI of stored gradient
        """
        # Validate gradient data
        if not validate_gradients(gradient_data):
            raise ValueError("Invalid gradient data")
        
        # Store in Walrus
        blob_id = await self.walrus_service.store(gradient_data, "application/octet-stream")
        
        # Record in database
        gradient_record = {
            "model_id": model_id,
            "contributor_id": contributor_id,
            "uri": blob_id,
            "timestamp": __import__('datetime').datetime.utcnow(),
            "size": len(gradient_data)
        }
        
        # Save to database
        if self.db:
            await self.db.gradients.insert_one(gradient_record)
        
        return blob_id
    
    async def retrieve_gradient(self, gradient_uri: str) -> bytes:
        """
        Retrieve gradient data from Walrus.
        
        Args:
            gradient_uri: URI of the gradient to retrieve
            
        Returns:
            Gradient data
        """
        try:
            data = await self.walrus_service.retrieve(gradient_uri)
            return data
        except Exception as e:
            raise ValueError(f"Failed to retrieve gradient: {str(e)}")
    
    async def list_gradients(self, model_id: str) -> List[str]:
        """
        List all gradients for a model.
        
        Args:
            model_id: Identifier of the model
            
        Returns:
            List of gradient URIs
        """
        if self.db:
            gradients = await self.db.gradients.find({"model_id": model_id}).to_list(None)
            return [g["uri"] for g in gradients]
        
        # For now, returning empty list
        return []
    
    async def validate_gradient(self, gradient_uri: str) -> bool:
        """
        Validate a gradient.
        
        Args:
            gradient_uri: URI of the gradient to validate
            
        Returns:
            Whether the gradient is valid
        """
        try:
            data = await self.retrieve_gradient(gradient_uri)
            return validate_gradients(data)
        except:
            return False
    
    async def parse_gradient_data(self, gradient_data: bytes) -> Dict[str, Any]:
        """
        Parse gradient data from bytes to structured format.
        
        Args:
            gradient_data: Raw gradient data as bytes
            
        Returns:
            Parsed gradient data as dictionary
        """
        try:
            # Try to parse as JSON first
            if isinstance(gradient_data, bytes):
                data_str = gradient_data.decode('utf-8')
            else:
                data_str = gradient_data
            
            parsed_data = json.loads(data_str)
            
            # Validate required fields
            required_fields = ['gradients', 'metadata', 'timestamp']
            for field in required_fields:
                if field not in parsed_data:
                    raise ValueError(f"Missing required field: {field}")
            
            return parsed_data
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse gradient data: {str(e)}")
    
    async def validate_gradient_structure(self, gradient_data: Dict[str, Any]) -> bool:
        """
        Validate the structure of gradient data.
        
        Args:
            gradient_data: Parsed gradient data
            
        Returns:
            Whether the gradient structure is valid
        """
        try:
            # Check metadata
            metadata = gradient_data.get('metadata', {})
            required_metadata = ['session_id', 'model_id', 'num_batches', 'batch_size']
            for field in required_metadata:
                if field not in metadata:
                    print(f"Missing metadata field: {field}")
                    return False
            
            # Check gradients
            gradients = gradient_data.get('gradients', {})
            if not isinstance(gradients, dict):
                print("Gradients must be a dictionary")
                return False
            
            # Check that gradients are not empty
            if len(gradients) == 0:
                print("Gradients cannot be empty")
                return False
            
            # Check format version
            format_version = gradient_data.get('format_version', '')
            if format_version != '1.0':
                print(f"Unsupported format version: {format_version}")
                return False
            
            return True
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return False