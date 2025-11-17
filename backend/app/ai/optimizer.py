"""
Optimization algorithms for Sui-DAT.
Implements various optimization algorithms for training neural networks.
"""

import numpy as np
from typing import Dict, Any

class Optimizer:
    """Base optimizer class."""
    
    def __init__(self, learning_rate: float = 0.01):
        self.learning_rate = learning_rate
    
    def update(self, weights: Dict[str, np.ndarray], gradients: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        """Update weights based on gradients."""
        raise NotImplementedError

class SGDOptimizer(Optimizer):
    """Stochastic Gradient Descent optimizer."""
    
    def __init__(self, learning_rate: float = 0.01):
        super().__init__(learning_rate)
    
    def update(self, weights: Dict[str, np.ndarray], gradients: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        """Update weights using SGD."""
        updated_weights = {}
        for key in weights:
            if key in gradients:
                updated_weights[key] = weights[key] - self.learning_rate * gradients[key]
            else:
                updated_weights[key] = weights[key]
        return updated_weights

class MomentumOptimizer(Optimizer):
    """SGD with momentum optimizer."""
    
    def __init__(self, learning_rate: float = 0.01, momentum: float = 0.9):
        super().__init__(learning_rate)
        self.momentum = momentum
        self.velocity = {}
    
    def update(self, weights: Dict[str, np.ndarray], gradients: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        """Update weights using SGD with momentum."""
        updated_weights = {}
        for key in weights:
            # Initialize velocity if not present
            if key not in self.velocity:
                self.velocity[key] = np.zeros_like(gradients.get(key, np.array([])))
            
            if key in gradients:
                # Update velocity
                self.velocity[key] = self.momentum * self.velocity[key] + self.learning_rate * gradients[key]
                # Update weights
                updated_weights[key] = weights[key] - self.velocity[key]
            else:
                updated_weights[key] = weights[key]
        return updated_weights

class AdamOptimizer(Optimizer):
    """Adam optimizer."""
    
    def __init__(self, learning_rate: float = 0.001, beta1: float = 0.9, beta2: float = 0.999, epsilon: float = 1e-8):
        super().__init__(learning_rate)
        self.beta1 = beta1
        self.beta2 = beta2
        self.epsilon = epsilon
        self.m = {}
        self.v = {}
        self.t = 0
    
    def update(self, weights: Dict[str, np.ndarray], gradients: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        """Update weights using Adam."""
        self.t += 1
        updated_weights = {}
        
        for key in weights:
            # Initialize momentum and velocity if not present
            if key not in self.m:
                self.m[key] = np.zeros_like(gradients.get(key, np.array([])))
            if key not in self.v:
                self.v[key] = np.zeros_like(gradients.get(key, np.array([])))
            
            if key in gradients:
                # Update biased first moment estimate
                self.m[key] = self.beta1 * self.m[key] + (1 - self.beta1) * gradients[key]
                # Update biased second raw moment estimate
                self.v[key] = self.beta2 * self.v[key] + (1 - self.beta2) * np.square(gradients[key])
                
                # Compute bias-corrected first moment estimate
                m_hat = self.m[key] / (1 - np.power(self.beta1, self.t))
                # Compute bias-corrected second raw moment estimate
                v_hat = self.v[key] / (1 - np.power(self.beta2, self.t))
                
                # Update weights
                updated_weights[key] = weights[key] - self.learning_rate * m_hat / (np.sqrt(v_hat) + self.epsilon)
            else:
                updated_weights[key] = weights[key]
        return updated_weights