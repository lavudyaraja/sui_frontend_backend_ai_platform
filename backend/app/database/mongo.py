"""
MongoDB connection and utilities
"""

import os
import ssl
import certifi
import motor.motor_asyncio
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from backend directory
# Try multiple paths to find .env file
env_paths = [
    Path(__file__).parent.parent / '.env',  # backend/.env
    Path(__file__).parent.parent.parent / 'backend' / '.env',  # project/backend/.env
    Path('.env'),  # Current directory
]
for env_path in env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        break
else:
    # If no .env found, try loading from current directory
    load_dotenv()

# Get MongoDB URI from environment
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")


class Database:
    """Database connection manager"""
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
        self.connected: bool = False


# Global database instance
database_instance = Database()


async def connect_to_mongo() -> bool:
    """Connect to MongoDB"""
    try:
        print("Connecting to MongoDB...")
        print(f"MongoDB URI: {MONGODB_URI[:50]}...")  # Print first 50 chars for debugging
        
        # Check if it's a MongoDB Atlas connection (mongodb+srv://)
        if MONGODB_URI.startswith("mongodb+srv://"):
            database_instance.client = motor.motor_asyncio.AsyncIOMotorClient(
                MONGODB_URI,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                maxPoolSize=10,
                minPoolSize=1,
                retryWrites=True,
                w="majority"
            )
        else:
            # Local MongoDB connection
            database_instance.client = motor.motor_asyncio.AsyncIOMotorClient(
                MONGODB_URI,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                maxPoolSize=10,
                minPoolSize=1
            )
        
        # Test connection
        await database_instance.client.admin.command('ping')
        database_instance.db = database_instance.client["sui_dat"]
        database_instance.connected = True
        
        print("✅ Connected to MongoDB successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("⚠️  Application will continue without MongoDB connection")
        database_instance.connected = False
        return False


async def close_mongo_connection():
    """Close MongoDB connection"""
    try:
        if database_instance.client:
            database_instance.client.close()
            database_instance.connected = False
            print("Closed MongoDB connection")
    except Exception as e:
        print(f"Error closing MongoDB connection: {e}")
        database_instance.connected = False
        database_instance.client = None


def is_connected() -> bool:
    """Check if MongoDB is connected (synchronous, non-blocking)"""
    # This is a simple check that doesn't block
    return database_instance.connected and database_instance.client is not None


def get_database():
    """Get database instance"""
    if not database_instance.connected or database_instance.db is None:
        raise Exception("Database not connected")
    return database_instance.db


def get_collection(collection_name: str):
    """Get a collection from the database"""
    if not database_instance.connected or database_instance.db is None:
        raise Exception("Database not connected")
    return database_instance.db[collection_name]

