"""
Dependencies for Sui-DAT backend.
Handles dependency injection for database connections and other services.
"""

from typing import AsyncGenerator
from app.database.mongo import get_database

async def get_db() -> AsyncGenerator:
    """Get database connection."""
    try:
        db = get_database()
        yield db
    except Exception as e:
        print(f"Database connection error: {e}")
        raise