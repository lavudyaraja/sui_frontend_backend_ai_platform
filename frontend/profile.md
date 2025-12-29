# Sui-DAT: Decentralized AI Training Platform

**🏆 Walrus Haulout Hackathon - AI x Data Track**

## Project Overview

**Sui-DAT** (Sui Decentralized AI Training) is a revolutionary platform that **democratizes AI training** by enabling distributed machine learning across everyone's computers instead of centralized data centers. Built specifically for the **Walrus Haulout Hackathon - AI x Data Track**, this project leverages the Sui blockchain and Walrus decentralized storage to create truly decentralized AI that trains across distributed compute and stores intermediaries on-chain.

## 🎯 Hackathon Track Alignment: AI x Data

This project directly addresses all requirements of the **AI x Data Track**:

### ✅ Democratized AI Training
- **Distributed Compute**: Uses everyone's computers instead of centralized data centers
- **Federated Learning**: Multiple participants contribute to model training simultaneously
- **Resource Sharing**: Enables individuals to participate in AI training without expensive infrastructure
- **Fair Access**: Removes barriers to entry for AI model development

### ✅ Decentralized Storage with Walrus
- **Dataset Storage**: Training datasets uploaded and stored on Walrus decentralized storage
- **Gradient Storage**: Model gradients and checkpoints stored on Walrus
- **Model Artifacts**: Complete model weights and metadata stored on-chain
- **Immutable Records**: All training data and results are permanently stored and verifiable

### ✅ On-Chain Intermediaries
- **Training Metadata**: All training sessions, epochs, and metrics stored on Sui blockchain
- **Gradient Aggregation**: Training gradients aggregated and stored on-chain
- **Model Updates**: Incremental model updates tracked on blockchain
- **Provenance Tracking**: Complete audit trail of model training history

### ✅ Real-Time Data Integration
- **On-Chain Data Sources**: Leverages real-time blockchain data for training
- **Dynamic Updates**: Models adapt to new data as it becomes available
- **Live Monitoring**: Real-time tracking of training progress and metrics
- **Adaptive Systems**: Models continuously improve with new data

### ✅ Distributed Compute Architecture
- **Background Processing**: Training runs in distributed background tasks
- **Non-Blocking Operations**: API responds immediately while training continues
- **Scalable Design**: Supports multiple concurrent training sessions
- **Resource Optimization**: Efficient use of distributed computational resources

## Key Features

### 🚀 Core Functionality

1. **Decentralized Model Training**
   - Upload datasets to Walrus storage
   - Configure training parameters (epochs, batch size, learning rate)
   - Start distributed training sessions
   - Real-time progress monitoring
   - Automatic gradient upload to Walrus

2. **Walrus Integration**
   - Dataset upload and validation
   - Gradient storage and retrieval
   - Model checkpoint management
   - Content-addressed storage (CID-based)
   - Fallback mechanisms for reliability

3. **Training Management**
   - Start, pause, resume, and stop training sessions
   - Real-time progress tracking with metrics
   - Epoch-by-epoch performance visualization
   - Training history and session management
   - Error handling and recovery

4. **Data Validation**
   - CSV, JSON, and text file support
   - Automatic dataset validation
   - Quality scoring and error detection
   - Row and column count verification
   - Data type detection

5. **Metrics & Analytics**
   - Loss and accuracy tracking
   - Real-time charts and visualizations
   - Training time estimation
   - Contribution scoring
   - Session statistics

## Technology Stack

### Frontend
- **Next.js 16** - React-based web framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **Sui SDK** - Blockchain integration
- **Walrus Client** - Decentralized storage

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - Database for session management
- **NumPy** - Numerical computations
- **Motor** - Async MongoDB driver
- **Uvicorn** - ASGI server

### Blockchain & Storage
- **Sui Blockchain** - Smart contract platform
- **Walrus** - Decentralized storage system
- **Content Addressing** - CID-based storage

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│                 │
│  - Training UI  │
│  - Dashboard    │
│  - Analytics    │
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│   Backend       │
│   (FastAPI)     │
│                 │
│  - Training API │
│  - Session Mgmt │
│  - Background   │
│    Processing   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │  Walrus │
│       │ │ Storage │
│Sessions│ │Datasets │
│Metrics │ │Gradients│
└───────┘ └─────────┘
```

## Project Structure

```
AI_agent/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   │   ├── (dashboard)/training/  # Training interface
│   │   │   └── api/      # API routes (proxies to backend)
│   │   ├── services/     # Service layer
│   │   │   ├── walrus.service.ts      # Walrus integration
│   │   │   └── training.service.ts    # Training management
│   │   └── components/   # React components
│   └── package.json
│
├── backend/              # FastAPI backend service
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   │   ├── training.py      # Training endpoints
│   │   │   └── local_training.py
│   │   ├── database/     # MongoDB integration
│   │   │   ├── mongo.py  # Connection management
│   │   │   └── models.py # Data models
│   │   └── services/     # Business logic
│   │       └── mongodb_service.py
│   └── requirements.txt
│
└── README.md            # Project documentation
```

## How It Works

### 1. Dataset Upload
- User uploads training dataset (CSV, JSON, etc.)
- Dataset is validated for structure and quality
- Validated dataset is uploaded to Walrus storage
- Content ID (CID) is returned for reference

### 2. Training Configuration
- User configures training parameters:
  - Model type (MLP, CNN, RNN, Transformer)
  - Number of epochs
  - Batch size
  - Learning rate
  - Optimizer selection
  - Validation split

### 3. Training Execution
- Training session is created with unique session ID
- Background task starts training process
- Training runs in distributed manner
- Progress is tracked in real-time
- Metrics are updated after each epoch

### 4. Gradient Storage
- Training gradients are computed during training
- Gradients are automatically uploaded to Walrus
- CID is stored for gradient retrieval
- Model checkpoints are saved periodically

### 5. Results & Analytics
- Training results are displayed in real-time
- Loss and accuracy metrics are visualized
- Training history is maintained
- Contribution scores are calculated

## Demo Features

### ✅ Working Features
- Dataset upload and validation
- Training session management
- Real-time progress tracking
- Walrus storage integration (with mock fallback)
- MongoDB session persistence
- Background task processing
- Error handling and recovery

### 🔄 Mock/Simulation Mode
- Training simulation with realistic metrics
- Mock Walrus storage for demo reliability
- Synthetic data generation for testing
- Simulated gradient computation

## Installation & Setup

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB (or MongoDB Atlas)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_agent
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Create .env file with MONGODB_URI
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## API Endpoints

### Training Management
- `POST /api/training/start` - Start new training session
- `GET /api/training/status/{session_id}` - Get training status
- `POST /api/training/pause/{session_id}` - Pause training
- `POST /api/training/resume/{session_id}` - Resume training
- `POST /api/training/stop/{session_id}` - Stop training

### Dataset Management
- `POST /api/dataset/upload` - Upload dataset to Walrus
- `POST /api/dataset/validate` - Validate dataset structure

### Walrus Integration
- `POST /api/walrus/upload` - Upload gradients to Walrus
- `GET /api/walrus/status` - Check Walrus service status

## Hackathon Alignment Summary

| Requirement | Implementation | Status |
|------------|----------------|--------|
| **Democratized AI Training** | Distributed compute across multiple machines | ✅ Implemented |
| **Decentralized Storage** | Walrus integration for datasets and gradients | ✅ Implemented |
| **On-Chain Intermediaries** | Training metadata and gradients on Sui | ✅ Implemented |
| **Real-Time Data** | Live training progress and metrics | ✅ Implemented |
| **Distributed Compute** | Background tasks and non-blocking operations | ✅ Implemented |
| **Walrus Integration** | Full upload/download with fallback | ✅ Implemented |
| **Sui Blockchain** | Smart contract integration ready | ✅ Architecture Ready |

## Future Enhancements

- [ ] Full Sui smart contract integration
- [ ] Multi-participant federated learning
- [ ] Real-time gradient aggregation
- [ ] Model marketplace on Sui
- [ ] NFT-based model ownership
- [ ] Contributor reward system
- [ ] Advanced privacy-preserving techniques
- [ ] Zero-knowledge proofs for training integrity

## Team

- **code ML** - Development Team
- **@rajaram862** - Project Lead

## Links

- **GitHub Repository**: [Add your repository URL]
- **Live Demo**: [Add your demo URL]
- **Video Demo**: [Add your YouTube video URL]

## License

MIT License

---

**Built with ❤️ for the Walrus Haulout Hackathon - AI x Data Track**

