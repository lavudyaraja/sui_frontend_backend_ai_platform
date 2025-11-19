# Sui-DAT: Decentralized AI Training Platform

<div align="center">
  <img src="frontend/public/logos/main-logo.svg" alt="Sui-DAT Logo" width="200"/>
</div>

**🏆 Walrus Haulout Hackathon - AI x Data Track**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0%2B-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0%2B-black.svg)](https://nextjs.org/)

Sui-DAT (Sui Decentralized AI Training) is a revolutionary platform that **democratizes AI training** by enabling distributed machine learning across everyone's computers instead of centralized data centers. Built for the **Walrus Haulout Hackathon - AI x Data Track**, this project leverages the Sui blockchain and Walrus storage to create truly decentralized AI that trains across distributed compute and stores intermediaries on-chain.

## 🎯 Hackathon Alignment: AI x Data Track

This project directly addresses the AI x Data track requirements:

- ✅ **Democratized AI Training**: Uses distributed compute across multiple participants' machines instead of centralized data centers
- ✅ **Decentralized Storage**: Stores training data, gradients, and model checkpoints on Walrus decentralized storage
- ✅ **On-Chain Intermediaries**: Stores training metadata, gradients, and model updates on Sui blockchain
- ✅ **Real-Time Data Integration**: Leverages on-chain data for training and model updates
- ✅ **Adaptive Systems**: Enables federated learning with real-time gradient aggregation

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Frontend](#frontend)
- [Backend](#backend)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Project Overview

Sui-DAT revolutionizes AI model training by distributing the computational load across multiple participants while leveraging blockchain technology for transparent operations and fair reward distribution. The platform allows contributors to participate in training sessions, submit gradients, and earn reputation and rewards based on their contributions.

## Key Features

- **Decentralized Training**: Distribute model training across multiple participants
- **Blockchain Integration**: Secure operations and transparent reward distribution using Sui blockchain
- **Walrus Storage**: Efficient, decentralized storage for model data and gradients
- **Collaborative Learning**: Multiple participants can contribute to the same model
- **Reputation System**: Track and reward contributors based on their contributions
- **Real-time Monitoring**: Track training progress and performance metrics
- **AI-Powered Suggestions**: Get model architecture and hyperparameter suggestions using OpenAI
- **Web-based Interface**: User-friendly dashboard for managing training sessions

## Architecture

The Sui-DAT platform follows a microservices architecture with the following components:

```
AI_agent/
├── backend/           # FastAPI backend service
├── frontend/          # Next.js web interface
├── contracts/         # Sui Move smart contracts
└── README.md          # Project documentation
```

### Component Interactions

1. **Frontend** ↔ **Backend**: REST API communication
2. **Backend** ↔ **MongoDB**: Data persistence
3. **Backend** ↔ **Sui Blockchain**: Smart contract interactions
4. **Backend** ↔ **Walrus**: Decentralized storage
5. **Participants** ↔ **Frontend**: User interactions

## Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for data persistence
- **Sui SDK**: Blockchain integration
- **Walrus Client**: Decentralized storage
- **OpenAI API**: AI-powered suggestions (optional)

### Frontend
- **Next.js**: React-based web framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **React Flow**: Workflow visualization

### Blockchain
- **Sui**: High-performance blockchain
- **Walrus**: Decentralized storage system

## Project Structure

```
AI_agent/
├── backend/                    # FastAPI backend service
│   ├── app/                    # Application source code
│   │   ├── ai/                 # AI training logic
│   │   ├── database/           # Database models
│   │   ├── routers/            # API endpoints
│   │   ├── services/           # Business logic
│   │   ├── config.py           # Configuration
│   │   └── main.py             # Application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── vercel.json             # Backend deployment configuration
│   └── README.md               # Backend documentation
├── frontend/                   # Next.js web interface
│   ├── src/                    # Source code
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utility functions
│   │   └── services/           # API services
│   ├── public/                 # Static assets
│   │   └── logos/              # Project logos
│   │       ├── sui-dat-logo.svg # Main project logo
│   │       ├── sui-dat-icon.svg # Navbar icon
│   │       ├── main-logo.svg    # Legacy logo
│   │       └── white-logo.svg   # Legacy logo
│   └── README.md               # Frontend documentation
├── contracts/                  # Sui Move smart contracts
│   ├── sui-dat/                # Main contract package
│   │   ├── sources/            # Move source files
│   │   ├── Move.toml           # Package configuration
│   │   ├── README.md           # Contract documentation
│   │   ├── deploy.sh/bat       # Deployment scripts
│   │   └── init.sh/bat         # Initialization scripts
│   └── README.md               # Contracts overview
└── README.md                   # Project documentation
```

## Smart Contracts

The Sui-DAT platform uses Sui Move smart contracts to manage decentralized AI training:

### Contract Modules

1. **Model Module**: Manages AI model versions and training workflow
2. **Contributor Module**: Handles participant reputation and contribution tracking

### Deployment

```bash
# Navigate to contracts directory
cd contracts/sui-dat

# Build contracts
sui move build

# Deploy contracts
sui client publish --gas-budget 100000000
```

For detailed contract documentation, see [contracts/sui-dat/README.md](contracts/sui-dat/README.md).

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AI_agent
   ```

2. **Backend setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

## Usage

### Running the Backend

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## API Documentation

The backend provides comprehensive RESTful APIs for all platform functionalities. Detailed API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Core API Endpoints

#### Training Management
- `POST /api/training/start` - Start a new training session
- `GET /api/training/status/{session_id}` - Get training status
- `POST /api/training/pause/{session_id}` - Pause training
- `POST /api/training/resume/{session_id}` - Resume training
- `POST /api/training/stop/{session_id}` - Stop training

#### Model Management
- `GET /api/training/model/{model_id}` - Get model information
- `GET /api/training/model-details/{model_id}` - Get comprehensive model details

#### Contributor Management
- `POST /api/contributors/register` - Register a new contributor
- `GET /api/contributors/leaderboard` - Get contributor leaderboard

## Frontend

The frontend is built with Next.js and provides a comprehensive web interface for:

- **Dashboard**: Overview of training sessions and system status
- **Training Management**: Start, monitor, and control training sessions
- **Model Explorer**: View model details and training history
- **Contributor Portal**: Track contributions and reputation
- **Wallet Integration**: Connect Sui wallet for blockchain interactions

For detailed frontend documentation, see [frontend/README.md](frontend/README.md).

## Backend

The backend is built with FastAPI and provides:

- **RESTful API**: Comprehensive endpoints for all platform functionalities
- **Database Integration**: MongoDB for data persistence
- **Blockchain Integration**: Sui smart contract interactions
- **Storage Integration**: Walrus decentralized storage
- **AI Services**: OpenAI integration for intelligent suggestions

For detailed backend documentation, see [backend/README.md](backend/README.md).

## Contributing

We welcome contributions to the Sui-DAT project! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Screenshot Images
<img width="1910" height="2154" alt="screen-7" src="https://github.com/user-attachments/assets/86c6eaf4-69ae-48e2-9db6-612a710356ff" />
<img width="1910" height="4830" alt="screen-6" src="https://github.com/user-attachments/assets/7679aca4-d746-4cd3-8d47-0e8cef21ec8a" />
<img width="1910" height="2468" alt="screen-5" src="https://github.com/user-attachments/assets/ae93bd45-65dd-4761-9622-32a38e681b34" />
<img width="1910" height="2935" alt="screen-4" src="https://github.com/user-attachments/assets/638583e3-69f3-4523-9581-29851eaaa6e0" />
<img width="1910" height="2853" alt="screen-3" src="https://github.com/user-attachments/assets/a9cbcee5-4b5d-4bf2-823e-bcd7e5c797e0" />
<img width="2040" height="1654" alt="screen-2" src="https://github.com/user-attachments/assets/28bd07cd-eefc-4b9f-92e2-f30ac245660e" />
<img width="1910" height="1830" alt="screen-1" src="https://github.com/user-attachments/assets/0afbd59a-0c45-42e3-8903-a7eddd3b47b8" />


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.

### Community

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for real-time discussions
- **Twitter**: Follow us for updates and announcements

### Documentation

- **API Docs**: Available at http://localhost:8000/docs when backend is running
- **Tutorials**: Coming soon
