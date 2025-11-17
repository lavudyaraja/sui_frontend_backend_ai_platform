"""
Local training loop for Sui-DAT.
Implements the training process for individual contributors.
"""

import numpy as np
from typing import Dict, Any, Tuple, Optional
import pandas as pd
import io
import json

# Import the proper TinyCNN model
from app.ai.models.tiny_cnn import TinyCNN



class Trainer:
    def __init__(self, model_id: str, params: Dict[str, Any]):
        """
        Initialize the trainer.
        
        Args:
            model_id: Identifier of the model to train
            params: Training parameters
        """
        self.model_id = model_id
        self.params = params
        self.model = None
        self.history = []
        self.optimizer_state = {}
        
        # Initialize model based on parameters
        self._initialize_model()
        
        # Debug: Check if model was properly initialized
        if self.model is None:
            raise ValueError("Model failed to initialize")
    
    def _initialize_model(self):
        """Initialize the model based on parameters."""
        model_type = self.params.get('model_type', 'mlp')
        
        if model_type == 'tiny_cnn' or model_type == 'cnn':
            input_shape = self.params.get('input_shape', (28, 28, 1))
            num_classes = self.params.get('num_classes', 10)
            self.model = TinyCNN(input_shape, num_classes)
        else:  # mlp or default
            input_size = self.params.get('input_size', 784)
            num_classes = self.params.get('num_classes', 10)
            # For the MLP case, we use TinyCNN with a flattened input shape
            self.model = TinyCNN((input_size, 1, 1), num_classes)
    
    def train_step(self, X_batch: np.ndarray, y_batch: np.ndarray) -> Dict[str, float]:
        """
        Perform a single training step.
        
        Args:
            X_batch: Input batch
            y_batch: Target batch
            
        Returns:
            Training metrics
        """
        if self.model is None:
            raise ValueError("Model not initialized")
            
        # Forward pass
        output = self.model.forward(X_batch)
        
        # Compute loss (cross-entropy)
        epsilon = 1e-15
        output = np.clip(output, epsilon, 1 - epsilon)
        loss = -np.mean(np.sum(y_batch * np.log(output), axis=1))
        
        # Compute accuracy
        predictions = np.argmax(output, axis=1)
        true_labels = np.argmax(y_batch, axis=1)
        accuracy = np.mean(predictions == true_labels)
        
        # Backward pass
        gradients = self.model.backward(X_batch, y_batch, output)
        
        # Apply gradients
        learning_rate = self.params.get('learning_rate', 0.001)
        self._apply_gradients(gradients, learning_rate)
        
        # Store metrics
        metrics = {
            "loss": float(loss),
            "accuracy": float(accuracy)
        }
        
        self.history.append(metrics)
        
        return metrics
    
    def _apply_gradients(self, gradients: Dict[str, np.ndarray], learning_rate: float):
        """Apply gradients with momentum"""
        if self.model is None:
            return
            
        momentum = self.params.get('momentum', 0.9)
        
        for key in gradients:
            if key not in self.optimizer_state:
                self.optimizer_state[key] = np.zeros_like(gradients[key])
            
            # Update velocity
            self.optimizer_state[key] = momentum * self.optimizer_state[key] + (1 - momentum) * gradients[key]
            
            # Apply update
            # Get current weights
            current_weights = self.model.get_weights()
            if key in current_weights:
                current_weights[key] -= learning_rate * self.optimizer_state[key]
                # Update model weights
                self.model.set_weights(current_weights)
    
    def get_gradients(self) -> Dict[str, list]:
        """Get current model gradients as JSON-serializable lists"""
        if self.model is None:
            return {}
        weights = self.model.get_weights()
        return {k: v.tolist() if isinstance(v, np.ndarray) else v for k, v in weights.items()}
    
    def apply_gradients(self, gradients: Dict[str, Any]):
        """Apply gradients to update model weights"""
        if self.model is None:
            return
        weights = {}
        for k, v in gradients.items():
            weights[k] = np.array(v) if isinstance(v, list) else v
        self.model.set_weights(weights)
    
    def get_model_weights(self) -> Dict[str, list]:
        """Get current model weights as JSON-serializable lists"""
        if self.model is None:
            return {}
        weights = self.model.get_weights()
        return {k: v.tolist() if isinstance(v, np.ndarray) else v for k, v in weights.items()}
    
    def load_dataset_from_content(self, content: str, content_type: str = 'csv') -> Tuple[np.ndarray, np.ndarray]:
        """Load dataset from string content"""
        try:
            if content_type == 'csv' or content_type == 'text/csv':
                df = pd.read_csv(io.StringIO(content))
                
                if len(df.columns) < 2:
                    raise ValueError("Dataset must have at least 2 columns")
                
                X = df.iloc[:, :-1].values.astype(np.float32)
                y_raw = df.iloc[:, -1].values
                
                # One-hot encoding
                unique_labels = np.unique(y_raw)
                num_classes = len(unique_labels)
                
                y = np.zeros((len(y_raw), num_classes), dtype=np.float32)
                for i, label in enumerate(y_raw):
                    y[i, np.where(unique_labels == label)[0][0]] = 1
                
                return X, y
                
            elif content_type == 'json' or content_type == 'application/json':
                data = json.loads(content)
                
                if not isinstance(data, list) or len(data) == 0:
                    raise ValueError("JSON data must be a non-empty array")
                
                features = []
                targets = []
                
                for item in data:
                    if isinstance(item, dict):
                        if 'features' in item and 'target' in item:
                            features.append(item['features'])
                            targets.append(item['target'])
                        else:
                            keys = list(item.keys())
                            if len(keys) >= 2:
                                target_key = keys[-1]
                                feature_keys = keys[:-1]
                                feature_values = [item[key] for key in feature_keys]
                                features.append(feature_values)
                                targets.append(item[target_key])
                
                if len(features) == 0:
                    raise ValueError("Could not extract features from JSON")
                
                X = np.array(features, dtype=np.float32)
                y_raw = np.array(targets)
                
                # One-hot encoding
                unique_labels = np.unique(y_raw)
                num_classes = len(unique_labels)
                
                y = np.zeros((len(y_raw), num_classes), dtype=np.float32)
                for i, label in enumerate(y_raw):
                    y[i, np.where(unique_labels == label)[0][0]] = 1
                
                return X, y
                
        except Exception as e:
            print(f"Failed to load dataset: {e}")
            raise
        
        return np.array([]), np.array([])
    
    def train_on_dataset(self, dataset_content: str, content_type: str = 'csv') -> Dict[str, Any]:
        """Train the model on a dataset"""
        try:
            # Load dataset
            X, y = self.load_dataset_from_content(dataset_content, content_type)
            
            if X.size == 0 or y.size == 0:
                raise ValueError("Failed to load dataset or dataset is empty")
            
            # Training parameters
            epochs = self.params.get('epochs', 10)
            batch_size = self.params.get('batch_size', 32)
            
            # Training loop
            history = []
            num_samples = X.shape[0]
            
            for epoch in range(epochs):
                epoch_losses = []
                epoch_accuracies = []
                
                # Shuffle data
                indices = np.random.permutation(num_samples)
                X_shuffled = X[indices]
                y_shuffled = y[indices]
                
                # Batch training
                for i in range(0, num_samples, batch_size):
                    X_batch = X_shuffled[i:i+batch_size]
                    y_batch = y_shuffled[i:i+batch_size]
                    
                    # Perform training step
                    metrics = self.train_step(X_batch, y_batch)
                    epoch_losses.append(metrics["loss"])
                    epoch_accuracies.append(metrics["accuracy"])
                
                # Calculate epoch metrics
                avg_loss = float(np.mean(epoch_losses))
                avg_accuracy = float(np.mean(epoch_accuracies))
                
                epoch_metrics = {
                    "epoch": int(epoch + 1),
                    "loss": avg_loss,
                    "accuracy": avg_accuracy
                }
                
                history.append(epoch_metrics)
                print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f} - Accuracy: {avg_accuracy:.4f}")
            
            return {
                "status": "completed",
                "history": history,
                "final_loss": history[-1]["loss"] if history else 0.0,
                "final_accuracy": history[-1]["accuracy"] if history else 0.0
            }
            
        except Exception as e:
            return {
                "status": "failed",
                "error": str(e)
            }