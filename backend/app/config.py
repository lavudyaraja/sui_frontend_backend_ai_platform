"""
Configuration module for Sui-DAT backend.
Loads environment variables and defines constants.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Sui blockchain configuration
SUI_NETWORK = os.getenv("SUI_NETWORK", "testnet")
SUI_RPC_URL = os.getenv("SUI_RPC_URL", "https://fullnode.testnet.sui.io:443")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
CONTRACT_MODULE = os.getenv("CONTRACT_MODULE", "sui_dat")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# Walrus storage configuration
WALRUS_ENDPOINT = os.getenv("WALRUS_ENDPOINT", "http://localhost:31415")

# Database configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# AI model configuration
LEARNING_RATE = float(os.getenv("LEARNING_RATE", 0.01))
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 32))
EPOCHS = int(os.getenv("EPOCHS", 10))

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Logging configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "sui_dat_backend.log")

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")