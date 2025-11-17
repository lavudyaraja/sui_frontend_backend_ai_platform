"""
Federated averaging implementation for Sui-DAT.
Implements the federated averaging algorithm for gradient aggregation.
"""

import numpy as np
from typing import List, Dict, Any

def federated_average(gradients_list: List[Dict[str, np.ndarray]]) -> Dict[str, np.ndarray]:
    """
    Perform federated averaging on a list of gradients.
    
    Args:
        gradients_list: List of gradient dictionaries
        
    Returns:
        Averaged gradients
    """
    if not gradients_list:
        raise ValueError("No gradients to average")
    
    # Initialize result with zeros of the same shape as first gradient
    averaged = {}
    first_gradients = gradients_list[0]
    
    # Initialize averaged gradients with zeros
    for key, grad in first_gradients.items():
        averaged[key] = np.zeros_like(grad)
    
    # Sum all gradients
    for gradients in gradients_list:
        for key, grad in gradients.items():
            if key in averaged:
                averaged[key] += grad
            else:
                # Handle case where a key is missing in some gradients
                averaged[key] = grad.copy()
    
    # Divide by number of gradients to get average
    num_gradients = len(gradients_list)
    for key in averaged:
        averaged[key] /= num_gradients
    
    return averaged

def weighted_federated_average(gradients_list: List[Dict[str, np.ndarray]], 
                              weights: List[float]) -> Dict[str, np.ndarray]:
    """
    Perform weighted federated averaging on a list of gradients.
    
    Args:
        gradients_list: List of gradient dictionaries
        weights: List of weights for each gradient set
        
    Returns:
        Weighted averaged gradients
    """
    if not gradients_list or len(gradients_list) != len(weights):
        raise ValueError("Invalid gradients or weights")
    
    # Normalize weights
    total_weight = sum(weights)
    if total_weight == 0:
        raise ValueError("Total weight cannot be zero")
    
    normalized_weights = [w / total_weight for w in weights]
    
    # Initialize result with zeros of the same shape as first gradient
    averaged = {}
    first_gradients = gradients_list[0]
    
    # Initialize averaged gradients with zeros
    for key, grad in first_gradients.items():
        averaged[key] = np.zeros_like(grad)
    
    # Compute weighted sum
    for i, gradients in enumerate(gradients_list):
        weight = normalized_weights[i]
        for key, grad in gradients.items():
            if key in averaged:
                averaged[key] += weight * grad
            else:
                # Handle case where a key is missing in some gradients
                averaged[key] = weight * grad
    
    return averaged

def secure_federated_average(gradients_list: List[Dict[str, np.ndarray]], 
                           clipping_bound: float = 1.0) -> Dict[str, np.ndarray]:
    """
    Perform secure federated averaging with gradient clipping to prevent malicious contributions.
    
    Args:
        gradients_list: List of gradient dictionaries
        clipping_bound: Maximum norm for gradient clipping
        
    Returns:
        Securely averaged gradients
    """
    if not gradients_list:
        raise ValueError("No gradients to average")
    
    # Clip gradients to prevent malicious contributions
    clipped_gradients = []
    for gradients in gradients_list:
        # Compute global norm
        global_norm = np.sqrt(sum(np.sum(grad**2) for grad in gradients.values()))
        
        # Clip if necessary
        if global_norm > clipping_bound:
            scaling_factor = clipping_bound / global_norm
            clipped = {}
            for key, grad in gradients.items():
                clipped[key] = grad * scaling_factor
            clipped_gradients.append(clipped)
        else:
            clipped_gradients.append(gradients)
    
    # Perform standard federated averaging on clipped gradients
    return federated_average(clipped_gradients)

def momentum_federated_average(gradients_list: List[Dict[str, np.ndarray]], 
                             previous_velocity: Dict[str, np.ndarray] = None,
                             momentum: float = 0.9) -> tuple:
    """
    Perform federated averaging with momentum for faster convergence.
    
    Args:
        gradients_list: List of gradient dictionaries
        previous_velocity: Previous velocity for momentum (optional)
        momentum: Momentum coefficient
        
    Returns:
        Tuple of (averaged_gradients, new_velocity)
    """
    # Get standard averaged gradients
    avg_gradients = federated_average(gradients_list)
    
    # Initialize velocity if not provided
    if previous_velocity is None:
        velocity = {key: np.zeros_like(grad) for key, grad in avg_gradients.items()}
    else:
        velocity = previous_velocity.copy()
    
    # Update velocity with momentum
    new_velocity = {}
    for key, grad in avg_gradients.items():
        if key in velocity:
            new_velocity[key] = momentum * velocity[key] + (1 - momentum) * grad
        else:
            new_velocity[key] = grad
    
    # Return averaged gradients and new velocity
    return avg_gradients, new_velocity

def convert_numpy_arrays_to_lists(data: Any) -> Any:
    """
    Recursively convert numpy arrays to lists for JSON serialization.
    
    Args:
        data: Data structure that may contain numpy arrays
        
    Returns:
        Data structure with numpy arrays converted to lists
    """
    if isinstance(data, dict):
        return {key: convert_numpy_arrays_to_lists(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_numpy_arrays_to_lists(item) for item in data]
    elif isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, np.integer):
        return int(data)
    elif isinstance(data, np.floating):
        return float(data)
    else:
        return data