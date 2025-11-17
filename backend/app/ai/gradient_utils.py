"""
Gradient utility functions for Sui-DAT.
Handles gradient extraction, conversion, and validation.
"""

import numpy as np
from typing import Dict, Any, Union

def extract_gradients(model_weights: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
    """
    Extract gradients from model weights.
    
    Args:
        model_weights: Dictionary of model weights
        
    Returns:
        Dictionary of gradients
    """
    # In a real implementation, this would compute actual gradients
    # For now, we're just returning the weights as gradients
    return model_weights.copy()

def convert_gradients_to_bytes(gradients: Dict[str, np.ndarray]) -> bytes:
    """
    Convert gradients to bytes for storage/transmission.
    
    Args:
        gradients: Dictionary of gradients
        
    Returns:
        Serialized gradients as bytes
    """
    # Flatten all gradients into a single array
    flattened = []
    keys = []
    shapes = []
    
    for key, grad in gradients.items():
        keys.append(key)
        shapes.append(grad.shape)
        flattened.append(grad.flatten())
    
    # Combine all flattened arrays
    combined = np.concatenate(flattened) if flattened else np.array([])
    
    # Create metadata
    metadata = {
        'keys': keys,
        'shapes': shapes,
        'dtype': combined.dtype.name if combined.size > 0 else 'float64'
    }
    
    # Serialize metadata and data
    import json
    metadata_bytes = json.dumps(metadata).encode('utf-8')
    data_bytes = combined.tobytes()
    
    # Combine metadata length + metadata + data
    metadata_length = len(metadata_bytes)
    result = metadata_length.to_bytes(4, byteorder='big') + metadata_bytes + data_bytes
    
    return result

def convert_bytes_to_gradients(data: bytes) -> Dict[str, np.ndarray]:
    """
    Convert bytes back to gradients.
    
    Args:
        data: Serialized gradients as bytes
        
    Returns:
        Dictionary of gradients
    """
    # Extract metadata length
    metadata_length = int.from_bytes(data[:4], byteorder='big')
    
    # Extract metadata
    metadata_bytes = data[4:4+metadata_length]
    import json
    metadata = json.loads(metadata_bytes.decode('utf-8'))
    
    # Extract data
    data_bytes = data[4+metadata_length:]
    
    # Reconstruct array
    dtype = np.dtype(metadata['dtype'])
    combined = np.frombuffer(data_bytes, dtype=dtype)
    
    # Split into individual gradients
    gradients = {}
    idx = 0
    
    for key, shape in zip(metadata['keys'], metadata['shapes']):
        size = np.prod(shape)
        grad_flat = combined[idx:idx+size]
        gradients[key] = grad_flat.reshape(shape)
        idx += size
    
    return gradients

def validate_gradients(data: Union[bytes, Dict[str, np.ndarray]]) -> bool:
    """
    Validate gradient data.
    
    Args:
        data: Gradient data as bytes or dictionary
        
    Returns:
        Whether the gradients are valid
    """
    try:
        # If data is bytes, convert to dictionary
        if isinstance(data, bytes):
            gradients = convert_bytes_to_gradients(data)
        else:
            gradients = data
        
        # Check that gradients is a dictionary
        if not isinstance(gradients, dict):
            return False
        
        # Check that all values are numpy arrays
        for key, value in gradients.items():
            if not isinstance(value, np.ndarray):
                return False
        
        return True
    except:
        return False