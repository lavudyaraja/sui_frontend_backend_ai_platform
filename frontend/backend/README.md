# Sui-DAT Backend

<div align="center">
  <img src="../frontend/public/logos/sui-dat-logo.svg" alt="Sui-DAT Logo" width="150"/>
</div>

Decentralized AI Training Platform Backend - AI x Data Track

## Overview

The Sui-DAT backend is built with FastAPI and provides RESTful APIs for managing decentralized AI training sessions. It handles training orchestration, participant management, and integration with Sui blockchain and Walrus storage.

## Quick Start

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Training Endpoints

- `POST /api/training/start` - Start a new training session
- `GET /api/training/status/{session_id}` - Get training status
- `POST /api/training/pause/{session_id}` - Pause training
- `POST /api/training/resume/{session_id}` - Resume training
- `POST /api/training/stop/{session_id}` - Stop training

### Local Training Endpoints

- `POST /api/local-training/start` - Start a new local training session
- `GET /api/local-training/status/{session_id}` - Get local training status
- `POST /api/local-training/pause/{session_id}` - Pause local training
- `POST /api/local-training/resume/{session_id}` - Resume local training
- `POST /api/local-training/stop/{session_id}` - Stop local training
- `POST /api/local-training/upload-gradients/{session_id}` - Upload gradients

## Health Check

- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API information

## Features

- ✅ Decentralized AI training simulation
- ✅ In-memory session storage with MongoDB fallback
- ✅ Background task processing
- ✅ Real-time progress tracking
- ✅ Error handling and validation
- ✅ CORS support for frontend integration
- ✅ Comprehensive API documentation

## Project Structure

```
backend/
├── app/                    # Main application
│   ├── ai/                # AI training logic
│   ├── database/          # Database models and connections
│   ├── routers/           # API route handlers
│   ├── services/          # Business logic
│   ├── config.py          # Configuration management
│   └── main.py            # Application entry point
├── requirements.txt        # Python dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn
- NumPy
- Pandas
- Pydantic
- python-dotenv

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# CORS configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# MongoDB configuration (optional)
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=sui_dat
```

## Deployment

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Deployment

The backend can be deployed to any cloud provider that supports Python applications. A `vercel.json` configuration file is included for easy deployment to Vercel.

## API Documentation

When the backend is running, comprehensive API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Contributing

See the main project [README.md](../README.md) for contribution guidelines.