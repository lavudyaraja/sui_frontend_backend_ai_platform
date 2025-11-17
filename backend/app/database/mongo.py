"""
MongoDB connection and utilities for Sui-DAT backend.
Handles database connections and operations.
"""

import motor.motor_asyncio
from app.config import MONGODB_URI
import asyncio
from typing import Optional, Any

class Database:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db: Optional[Any] = None

# Create a global instance
database_instance = Database()

async def connect_to_mongo():
    """Connect to MongoDB database."""
    try:
        print(f"Connecting to MongoDB at {MONGODB_URI}")
        
        # Simple connection for MongoDB Atlas
        database_instance.client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGODB_URI,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000
        )
            
        database_instance.db = database_instance.client["sui_dat"]
        
        # Test the connection
        await database_instance.client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection."""
    if database_instance.client:
        database_instance.client.close()
        print("Closed MongoDB connection")

def get_database():
    """Get database instance."""
    if database_instance.db is None:
        raise Exception("Database not initialized")
    return database_instance.db

def get_collection(collection_name: str):
    """Get a collection from the database."""
    if database_instance.db is None:
        raise Exception("Database not initialized")
    return database_instance.db[collection_name]