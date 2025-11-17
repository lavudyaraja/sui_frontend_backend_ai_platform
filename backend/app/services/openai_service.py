"""
OpenAI service for Sui-DAT backend.
Handles interactions with OpenAI API for AI model training and inference.
"""

import openai
from app.config import OPENAI_API_KEY
from typing import Optional, Dict, Any

class OpenAIService:
    """Service for OpenAI API interactions."""
    
    def __init__(self):
        """Initialize OpenAI client."""
        if OPENAI_API_KEY:
            self.client: Optional[openai.OpenAI] = openai.OpenAI(api_key=OPENAI_API_KEY)
        else:
            self.client = None
            print("Warning: OPENAI_API_KEY not found in environment variables")
    
    def is_configured(self) -> bool:
        """Check if OpenAI service is properly configured."""
        return self.client is not None
    
    def get_model_suggestion(self, model_type: str, dataset_info: str) -> Optional[str]:
        """
        Get AI model suggestions based on dataset information.
        
        Args:
            model_type: Type of model (e.g., "neural_network", "decision_tree")
            dataset_info: Information about the dataset
            
        Returns:
            Suggested model architecture or None if failed
        """
        if not self.is_configured():
            return None
            
        try:
            if self.client is None:
                return None
                
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI expert helping to suggest model architectures for decentralized AI training."},
                    {"role": "user", "content": f"Suggest a {model_type} architecture for a dataset with these characteristics: {dataset_info}. Provide a brief technical description."}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            content: Optional[str] = response.choices[0].message.content
            if content:
                return content.strip()
            return None
        except openai.RateLimitError as e:
            print(f"Rate limit exceeded: {e}")
            return "Rate limit exceeded. Please try again later."
        except openai.AuthenticationError as e:
            print(f"Authentication error: {e}")
            return "Invalid API key. Please check your OpenAI API key."
        except openai.PermissionDeniedError as e:
            print(f"Permission denied: {e}")
            return "Insufficient quota. Please check your OpenAI plan and billing details."
        except Exception as e:
            print(f"Error getting model suggestion from OpenAI: {e}")
            return None
    
    def analyze_training_results(self, results: Dict[str, Any]) -> Optional[str]:
        """
        Analyze training results using OpenAI.
        
        Args:
            results: Training results data
            
        Returns:
            Analysis of the results or None if failed
        """
        if not self.is_configured():
            return None
            
        try:
            if self.client is None:
                return None
                
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI expert analyzing machine learning training results."},
                    {"role": "user", "content": f"Analyze these training results and provide insights: {results}"}
                ],
                max_tokens=300,
                temperature=0.5
            )
            
            content: Optional[str] = response.choices[0].message.content
            if content:
                return content.strip()
            return None
        except openai.RateLimitError as e:
            print(f"Rate limit exceeded: {e}")
            return "Rate limit exceeded. Please try again later."
        except openai.AuthenticationError as e:
            print(f"Authentication error: {e}")
            return "Invalid API key. Please check your OpenAI API key."
        except openai.PermissionDeniedError as e:
            print(f"Permission denied: {e}")
            return "Insufficient quota. Please check your OpenAI plan and billing details."
        except Exception as e:
            print(f"Error analyzing training results with OpenAI: {e}")
            return None

# Global instance
openai_service = OpenAIService()