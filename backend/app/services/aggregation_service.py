"""
Aggregation service for Sui-DAT backend.
Implements federated averaging and SGD algorithms.
"""

import numpy as np
from typing import List, Dict, Any
from app.ai.aggregator import federated_average
# from app.ai.optimizer import apply_gradients
from app.services.walrus_service import WalrusService
from app.services.sui_service import SuiService

class AggregationService:
    def __init__(self, db):
        self.db = db
        self.walrus_service = WalrusService()
        self.sui_service = SuiService()
    
    async def aggregate_gradients(self, model_id: str, gradient_uris: List[str]) -> str:
        """
        Aggregate gradients using federated averaging.
        
        Args:
            model_id: Identifier of the model
            gradient_uris: List of gradient URIs to aggregate
            
        Returns:
            URI of aggregated gradients
        """
        # Retrieve all gradients
        gradients = []
        for uri in gradient_uris:
            try:
                grad_data = await self.walrus_service.retrieve(uri)
                gradients.append(grad_data)
            except Exception as e:
                print(f"Warning: Failed to retrieve gradient {uri}: {e}")
                continue
        
        if not gradients:
            raise ValueError("No valid gradients to aggregate")
        
        # Perform federated averaging
        aggregated = federated_average(gradients)
        
        # Store aggregated gradients
        blob_id = await self.walrus_service.store(aggregated, "application/octet-stream")
        
        return blob_id
    
    async def update_model_weights(self, model_id: str, weights_uri: str, contributor_count: int) -> str:
        """
        Update model weights on Sui blockchain.
        
        Args:
            model_id: Identifier of the model
            weights_uri: URI of new weights
            contributor_count: Number of contributors
            
        Returns:
            Transaction hash
        """
        tx_hash = await self.sui_service.update_model_version(
            model_id, 
            weights_uri, 
            contributor_count
        )
        return tx_hash