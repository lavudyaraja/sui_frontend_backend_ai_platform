"""
Base neural network model for Sui-DAT.
Defines the base architecture for AI models.
"""

import numpy as np
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseModel(ABC):
    def __init__(self, input_size: int, hidden_sizes: list, output_size: int):
        """
        Initialize the base model.
        
        Args:
            input_size: Size of input layer
            hidden_sizes: Sizes of hidden layers
            output_size: Size of output layer
        """
        self.input_size = input_size
        self.hidden_sizes = hidden_sizes
        self.output_size = output_size
        self.layers = []
        self.weights = {}
        self.biases = {}
        
        # Initialize model architecture
        self._build_model()
    
    def _build_model(self):
        """Build the neural network architecture."""
        layer_sizes = [self.input_size] + self.hidden_sizes + [self.output_size]
        
        for i in range(len(layer_sizes) - 1):
            layer_name = f"layer_{i}"
            input_dim = layer_sizes[i]
            output_dim = layer_sizes[i + 1]
            
            # Initialize weights and biases
            self.weights[layer_name] = np.random.randn(input_dim, output_dim) * 0.01
            self.biases[layer_name] = np.zeros((1, output_dim))
            
            self.layers.append(layer_name)
    
    @abstractmethod
    def forward(self, X: np.ndarray) -> np.ndarray:
        """
        Forward pass through the network.
        
        Args:
            X: Input data
            
        Returns:
            Output predictions
        """
        pass
    
    @abstractmethod
    def backward(self, X: np.ndarray, y: np.ndarray, output: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Backward pass to compute gradients.
        
        Args:
            X: Input data
            y: True labels
            output: Model output
            
        Returns:
            Gradients for each parameter
        """
        pass
    
    def get_weights(self) -> Dict[str, np.ndarray]:
        """
        Get current model weights.
        
        Returns:
            Dictionary of weights and biases
        """
        params = {}
        for layer in self.layers:
            params[f"{layer}_weights"] = self.weights[layer]
            params[f"{layer}_biases"] = self.biases[layer]
        return params
    
    def set_weights(self, weights: Dict[str, np.ndarray]):
        """
        Set model weights.
        
        Args:
            weights: Dictionary of weights and biases
        """
        for layer in self.layers:
            if f"{layer}_weights" in weights:
                weight_value = weights[f"{layer}_weights"]
                # Convert to numpy array if it's a list
                if isinstance(weight_value, list):
                    weight_value = np.array(weight_value)
                self.weights[layer] = weight_value
            if f"{layer}_biases" in weights:
                bias_value = weights[f"{layer}_biases"]
                # Convert to numpy array if it's a list
                if isinstance(bias_value, list):
                    bias_value = np.array(bias_value)
                self.biases[layer] = bias_value
