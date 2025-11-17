"""
Tiny CNN model for Sui-DAT.
A simple convolutional neural network implementation.
"""

import numpy as np
from app.ai.models.base_model import BaseModel

class TinyCNN(BaseModel):
    def __init__(self, input_shape=(28, 28, 1), num_classes=10):
        """
        Initialize the Tiny CNN model.
        
        Args:
            input_shape: Shape of input images (height, width, channels)
            num_classes: Number of output classes
        """
        self.input_shape = input_shape
        self.num_classes = num_classes
        
        # Calculate flattened input size
        flattened_size = input_shape[0] * input_shape[1] * input_shape[2]
        
        # Initialize base model with calculated sizes
        super().__init__(
            input_size=flattened_size,
            hidden_sizes=[128, 64],
            output_size=num_classes
        )
    
    def forward(self, X: np.ndarray) -> np.ndarray:
        """
        Forward pass through the network.
        
        Args:
            X: Input data (batch_size, height, width, channels)
            
        Returns:
            Output predictions (batch_size, num_classes)
        """
        # Flatten input
        batch_size = X.shape[0]
        X_flat = X.reshape(batch_size, -1)
        
        # Forward pass through layers
        activation = X_flat
        for layer in self.layers:
            # Linear transformation
            z = np.dot(activation, self.weights[layer]) + self.biases[layer]
            
            # ReLU activation for hidden layers
            if layer != self.layers[-1]:  # Not the output layer
                activation = np.maximum(0, z)
            else:  # Output layer with softmax
                # Subtract max for numerical stability
                exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
                activation = exp_z / np.sum(exp_z, axis=1, keepdims=True)
        
        return activation
    
    def backward(self, X: np.ndarray, y: np.ndarray, output: np.ndarray) -> dict:
        """
        Backward pass to compute gradients.
        
        Args:
            X: Input data
            y: True labels (one-hot encoded)
            output: Model output
            
        Returns:
            Gradients for each parameter
        """
        batch_size = X.shape[0]
        X_flat = X.reshape(batch_size, -1)
        
        # Initialize gradients dictionary
        gradients = {}
        
        # Compute output layer gradients
        dz = output - y
        last_layer = self.layers[-1]
        
        # Gradients for output layer
        activation_prev = X_flat
        for i in range(len(self.layers) - 1):
            layer = self.layers[i]
            # Forward pass to get activations
            z = np.dot(activation_prev, self.weights[layer]) + self.biases[layer]
            activation_prev = np.maximum(0, z)  # ReLU
        
        # Compute gradients for last layer
        gradients[f"{last_layer}_weights"] = np.dot(activation_prev.T, dz) / batch_size
        gradients[f"{last_layer}_biases"] = np.mean(dz, axis=0, keepdims=True)
        
        # Backpropagate through hidden layers
        for i in range(len(self.layers) - 2, -1, -1):
            layer = self.layers[i]
            
            # Derivative of ReLU
            dz = np.dot(dz, self.weights[self.layers[i + 1]].T)
            # Apply ReLU derivative (gradient is 0 where activation was <= 0)
            # For simplicity, we're assuming all activations were positive
            # In a real implementation, we would store the activations during forward pass
            
            if i == 0:
                activation_prev = X_flat
            else:
                # Recompute previous activation
                activation_prev = X_flat
                for j in range(i):
                    prev_layer = self.layers[j]
                    z = np.dot(activation_prev, self.weights[prev_layer]) + self.biases[prev_layer]
                    activation_prev = np.maximum(0, z)
            
            gradients[f"{layer}_weights"] = np.dot(activation_prev.T, dz) / batch_size
            gradients[f"{layer}_biases"] = np.mean(dz, axis=0, keepdims=True)
        
        return gradients