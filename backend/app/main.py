"""
FastAPI application for Sui-DAT Backend
Decentralized AI Training Platform - AI x Data Track
"""

import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uvicorn

# Load environment variables - load from backend directory
import os
from pathlib import Path
# Try multiple paths to find .env file
env_paths = [
    Path(__file__).parent.parent / '.env',  # backend/.env
    Path('.env'),  # Current directory
]
for env_path in env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        break
else:
    # If no .env found, try loading from current directory
    load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("🚀 Sui-DAT Backend Starting...")
    try:
        from app.database.mongo import connect_to_mongo
        connected = await connect_to_mongo()
        if connected:
            print("✅ MongoDB Connected - Using database storage")
        else:
            print("⚠️  MongoDB Not Connected - Using in-memory storage")
    except Exception as e:
        print(f"⚠️  MongoDB connection error: {e}")
        print("⚠️  Application will use in-memory storage")
    
    print("✅ Backend service ready")
    yield
    # Shutdown
    print("🛑 Sui-DAT Backend Shutting Down...")
    try:
        from app.database.mongo import close_mongo_connection
        await close_mongo_connection()
    except Exception as e:
        print(f"⚠️  Error closing MongoDB: {e}")


# Create FastAPI app
app = FastAPI(
    title="Sui-DAT Backend API - AI x Data Track",
    description="Decentralized AI Training Platform - Democratizing AI training using distributed compute",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    print(f"❌ Error: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "detail": str(exc),
            "error_type": type(exc).__name__
        }
    )


# Include routers
from app.routers import training, local_training

app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(local_training.router, prefix="/api/local-training", tags=["local-training"])


@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse(content={
        "message": "Sui-DAT Backend API",
        "version": "1.0.0",
        "status": "running",
        "description": "Decentralized AI Training Platform"
    })


@app.get("/health")
async def health():
    """Health check endpoint"""
    return JSONResponse(content={"status": "healthy"})


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT", "development") == "development"
    )

