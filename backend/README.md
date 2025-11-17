# Sui-DAT Backend

Backend service for the decentralized AI training platform built with FastAPI.

## Project Overview

Sui-DAT (Sui Decentralized AI Training) is a revolutionary platform that enables collaborative machine learning model training using the Sui blockchain and Walrus storage system. This backend service provides the core APIs and infrastructure for managing training sessions, storing model data, and coordinating with the decentralized network.

### Key Features

- **Decentralized Training**: Enables multiple participants to contribute to model training
- **Blockchain Integration**: Uses Sui blockchain for secure, transparent operations
- **Walrus Storage**: Leverages Walrus for efficient, decentralized data storage
- **MongoDB Persistence**: Stores training sessions, models, and contributor data
- **RESTful API**: Provides comprehensive endpoints for training management
- **Real-time Monitoring**: Tracks training progress and performance metrics

## Architecture

The backend follows a modular architecture with the following components:

```
backend/
├── app/
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration management
│   ├── dependencies.py      # Dependency injection
│   ├── ai/                  # AI model and training logic
│   ├── database/            # Database models and connections
│   ├── routers/             # API route handlers
│   └── services/            # Business logic services
├── requirements.txt         # Python dependencies
└── .env.example            # Environment variable templates
```

## Prerequisites

- Python 3.8+
- MongoDB (either local installation or MongoDB Atlas)
- Docker and Docker Compose (optional, for containerized deployment)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the example environment file and update with your configuration:

```bash
cp .env.example .env
```

Edit the [.env](file:///d:/created-project/AI_agent/backend/.env.example) file with your settings:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sui_dat

# Sui Blockchain Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key

# Walrus Storage Configuration
WALRUS_ENDPOINT=http://localhost:31415

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key
```

### 5. Set up MongoDB

Choose one of the following options:

**Option 1: Local MongoDB Installation**
- Install MongoDB locally (https://docs.mongodb.com/manual/installation/)
- Start MongoDB service

**Option 2: Docker MongoDB**
```bash
docker run -d -p 27017:27017 --name sui_dat_mongodb mongo:latest
```

**Option 3: MongoDB Atlas**
- Create a MongoDB Atlas account
- Update [.env](file:///d:/created-project/AI_agent/backend/.env.example) with your Atlas connection string

## Running the Application

### Development Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Or run directly with Python:
```bash
python -m app.main
```

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Using Docker

```bash
docker-compose up --build
```

## API Endpoints

### Health and Root Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint

### Training Endpoints

- `POST /api/training/start` - Start a new training session
- `POST /api/training/start-with-dataset` - Start training with dataset upload
- `GET /api/training/status/{session_id}` - Get training status
- `POST /api/training/pause/{session_id}` - Pause training
- `POST /api/training/resume/{session_id}` - Resume training
- `POST /api/training/stop/{session_id}` - Stop training
- `GET /api/training/sessions` - List all training sessions
- `GET /api/training/session/{session_id}` - Get detailed session information
- `POST /api/training/submit-gradients/{session_id}` - Submit training gradients

### Local Training Endpoints

- `POST /api/local-training/start` - Start a local training session
- `GET /api/local-training/status/{session_id}` - Get local training status
- `POST /api/local-training/pause/{session_id}` - Pause local training
- `POST /api/local-training/resume/{session_id}` - Resume local training
- `POST /api/local-training/stop/{session_id}` - Stop local training
- `POST /api/local-training/upload-gradients/{session_id}` - Upload gradients

### Model Endpoints

- `GET /api/training/model/{model_id}` - Get model information
- `GET /api/training/model-details/{model_id}` - Get comprehensive model details

### Dataset Endpoints

- `POST /api/dataset/upload` - Upload a dataset
- `GET /api/dataset/{dataset_id}` - Get dataset information

### Demo Endpoints

- `POST /api/demo/run-training` - Run a demo training session

## Database Schema

The application uses MongoDB to store all data in the following collections:

1. **Models** - Information about AI models including name, description, version, and accuracy
2. **Training Sessions** - Details of training sessions including status, progress, and metrics
3. **Gradients** - Submitted gradients from contributors with metadata
4. **Contributors** - Information about contributors and their reputation scores
5. **Datasets** - Information about uploaded datasets and their storage locations

## Data Persistence

All data is stored in MongoDB instead of local storage:
- Training sessions and their progress
- Model information and accuracy metrics
- Gradient submissions with contributor information
- Dataset metadata and storage references

This ensures data persistence across application restarts and enables horizontal scaling.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `SUI_NETWORK` | Sui network (testnet/mainnet) | `testnet` |
| `SUI_RPC_URL` | Sui RPC endpoint | `https://fullnode.testnet.sui.io:443` |
| `CONTRACT_ADDRESS` | Sui contract address | None |
| `PRIVATE_KEY` | Sui private key | None |
| `WALRUS_ENDPOINT` | Walrus storage endpoint | `http://localhost:31415` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | None |

## Development

The backend is built with FastAPI and uses:
- MongoDB for data storage
- Sui blockchain integration
- Walrus storage system
- OpenAI for AI-powered suggestions (optional)

### Project Structure

```
app/
├── main.py                 # FastAPI application setup
├── config.py               # Configuration management
├── dependencies.py         # Dependency injection
├── ai/                     # AI training and model logic
│   ├── models/             # Model definitions
│   ├── aggregator.py       # Gradient aggregation
│   ├── gradient_utils.py   # Gradient processing utilities
│   ├── optimizer.py        # Training optimizers
│   └── trainer.py          # Training orchestration
├── database/               # Database models and connections
│   ├── models.py           # Pydantic models
│   └── mongo.py            # MongoDB connection
├── routers/                # API route handlers
│   ├── train.py            # Training endpoints
│   ├── local_training.py   # Local training endpoints
│   ├── dataset.py          # Dataset endpoints
│   ├── gradients.py        # Gradient endpoints
│   ├── model.py            # Model endpoints
│   ├── contributors.py     # Contributor endpoints
│   ├── walrus.py           # Walrus storage endpoints
│   └── sui.py              # Sui blockchain endpoints
└── services/               # Business logic services
    ├── mongodb_service.py  # MongoDB operations
    ├── training_service.py # Training logic
    ├── gradient_service.py # Gradient processing
    ├── model_service.py    # Model management
    ├── walrus_service.py   # Walrus storage
    ├── sui_service.py      # Sui blockchain
    └── openai_service.py   # OpenAI integration
```

## Testing

Run the MongoDB integration test:
```bash
python test_mongodb_integration.py
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/created-project/AI_agent/LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.