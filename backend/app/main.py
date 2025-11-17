"""
FastAPI application entry point for Sui-DAT backend service.
Handles gradient aggregation, model updates, and Walrus/Sui integration.
"""

import os
import uuid
from datetime import datetime
from typing import Optional

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Sui-DAT Backend API",
    description="Backend service for decentralized AI training platform",
    version="1.0.0"
)

# Get allowed origins from environment variables or use defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Global exception handler to ensure JSON responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    print(f"Global exception handler caught: {exc}")
    import traceback
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "detail": f"An internal server error occurred: {str(exc)}",
            "error_type": type(exc).__name__
        }
    )


# Pydantic models for data validation
class DemoTrainingRequest(BaseModel):
    model_type: str = "mlp"
    epochs: int = 5
    participants: int = 3


# Include routers
try:
    from app.routers import local_training, train, dataset
    
    # Important: Load local_training first to initialize shared storage
    app.include_router(local_training.router, prefix="/api/local-training", tags=["local-training"])
    # train.py imports from local_training.py, so they share the same session storage
    app.include_router(train.router, prefix="/api/training", tags=["training"])
    # Include dataset router
    app.include_router(dataset.router, prefix="/api/dataset", tags=["dataset"])
    
    print("✅ Routers loaded successfully")
    print("📦 Both /api/training and /api/local-training share session storage")
    
except ImportError as e:
    print(f"⚠️  Router import warning: {e}")
    print("Some routes may not be available")
    import traceback
    traceback.print_exc()


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Sui-DAT Backend Service Starting...")
    # Connect to MongoDB
    from app.database.mongo import connect_to_mongo
    await connect_to_mongo()
    print("✅ Sui-DAT Backend Service Started Successfully!")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up services on shutdown"""
    print("🛑 Sui-DAT Backend Service Shutting Down...")
    # Close MongoDB connection
    from app.database.mongo import close_mongo_connection
    await close_mongo_connection()
    print("🧹 Cleanup completed")


# Demo endpoint for hackathon showcase
@app.post("/api/demo/run-training")
async def run_demo_training(request: DemoTrainingRequest):
    """Run a demo training session"""
    try:
        print(f"Starting demo training with {request.participants} participants")
        
        # Simulate gradient collection
        gradients = []
        for i in range(min(request.participants, 100)):
            mock_gradient = {
                f"layer_{j}_weights": [
                    [float((i+j+k) % 10) / 10.0 for k in range(10)] 
                    for _ in range(10)
                ]
                for j in range(3)
            }
            gradients.append(mock_gradient)
        
        print("Performing federated averaging...")
        print("Updating global model...")
        
        # Generate deterministic results
        seed = hash(str(request.model_type) + str(request.epochs) + str(request.participants))
        
        demo_results = {
            "model_id": f"demo_model_{uuid.uuid4().hex[:8]}",
            "final_accuracy": 92.5 + (seed % 20) / 10.0,
            "final_loss": 0.1 + (seed % 10) / 100.0,
            "participants": request.participants,
            "epochs_completed": request.epochs,
            "training_time_seconds": 45.0 + (seed % 150) / 10.0,
            "blockchain_transactions": request.participants + 1,
            "storage_blobs_created": request.participants + 1
        }
        
        return JSONResponse(content={
            "success": True,
            "status": "success",
            "message": "Demo training completed successfully!",
            "results": demo_results
        })
        
    except Exception as e:
        print(f"Demo training failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Demo training failed: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse(content={
        "message": "Sui-DAT Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "local_training": {
                "start": "POST /api/local-training/start",
                "status": "GET /api/local-training/status/{session_id}",
                "pause": "POST /api/local-training/pause/{session_id}",
                "resume": "POST /api/local-training/resume/{session_id}",
                "stop": "POST /api/local-training/stop/{session_id}",
                "upload": "POST /api/local-training/upload-gradients/{session_id}"
            },
            "training": {
                "start": "POST /api/training/start",
                "status": "GET /api/training/status/{session_id}",
                "pause": "POST /api/training/pause/{session_id}",
                "resume": "POST /api/training/resume/{session_id}",
                "stop": "POST /api/training/stop/{session_id}"
            }
        }
    })


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(content={
        "status": "healthy",
        "service": "sui-dat-backend",
        "timestamp": datetime.utcnow().isoformat()
    })


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT", "development") == "development"
    )