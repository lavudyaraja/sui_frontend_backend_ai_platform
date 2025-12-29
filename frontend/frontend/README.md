# Sui-DAT: Decentralized AI Training Platform

A cutting-edge decentralized AI training platform built on the Sui blockchain with Walrus storage, enabling collaborative machine learning while preserving data privacy and ownership.

## Description

Sui-DAT revolutionizes AI development by creating a trustless, decentralized ecosystem where:
- Data owners can contribute to AI training without exposing sensitive information
- Model creators can monetize their work through transparent marketplaces
- Contributors are fairly rewarded for their computational resources and data
- All training processes are verifiable through blockchain technology

The platform leverages the Sui blockchain for smart contract execution and state management, combined with Walrus storage for decentralized, immutable model storage. This creates a fully decentralized AI training pipeline that maintains data sovereignty while enabling collaborative machine learning.

## Features

### Decentralized Model Training
- Federated learning protocols for collaborative training
- Secure gradient aggregation with privacy preservation
- Differential privacy and secure multi-party computation techniques
- Real-time training progress monitoring

### Model Marketplace
- NFT-based model ownership and licensing
- Transparent pricing mechanisms with automated royalty distribution
- Model versioning and provenance tracking
- Trust scoring system for model quality assessment

### Data Contribution Portal
- Secure data contribution without exposing raw data
- Privacy-preserving techniques for sensitive datasets
- Contributor reward mechanisms
- Data quality verification and validation

### Wallet Integration
- Multi-wallet support (Sui Wallet, Ethos, etc.)
- Seamless transaction signing and verification
- Asset management for SUI tokens and NFTs
- Cross-chain compatibility

### Trust Verification
- Zero-knowledge proofs for training integrity
- Provenance tracking for data and models
- Oracle-based trust scoring system
- Transparent audit trails

### Real-time Analytics
- Training progress visualization
- Network statistics and performance metrics
- Contributor leaderboard and rewards tracking
- Model performance comparison tools

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Flow** - Workflow visualization
- **Zustand** - State management
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend & Blockchain
- **Sui Blockchain** - Smart contract execution and state management
- **Walrus Storage** - Decentralized, immutable storage
- **Sui.js** - JavaScript SDK for Sui blockchain interaction
- **Node.js** - Server-side runtime environment

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **GitHub Actions** - CI/CD pipeline

## Installation

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Sui wallet (Sui Wallet or compatible)

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration (see Environment Variables section)

## Usage

### Development Server

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

Build the application for production:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:
```bash
npm start
# or
yarn start
# or
pnpm start
```

### Available Scripts

- `dev` - Start development server
- `build` - Create production build
- `start` - Start production server
- `lint` - Run ESLint
- `setup-env` - Setup environment variables

## Folder Structure

```
src/
├── app/                    # Next.js app router pages and layouts
│   ├── (dashboard)/        # Main dashboard components and pages
│   ├── api/                # API routes for backend integration
│   ├── Marketing/          # Marketing and landing pages
│   └── ...                 # Other page routes
├── components/             # Reusable UI components
│   ├── layout/             # Layout components (header, sidebar, etc.)
│   ├── model/              # Model-specific components
│   ├── training/           # Training workflow components
│   └── ui/                 # Generic UI components (buttons, cards, etc.)
├── lib/                    # Utility libraries and helpers
│   ├── ai/                 # AI-related utilities
│   ├── api/                # API client utilities
│   ├── hooks/              # Custom React hooks
│   ├── sui/                # Sui blockchain utilities
│   └── walrus/             # Walrus storage utilities
├── services/               # Business logic and API services
├── store/                  # State management (Zustand stores)
├── types/                  # TypeScript type definitions
└── utils/                  # General utility functions
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Frontend Environment Variables

# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Sui Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet

# Walrus Configuration - Using working endpoints
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
WALRUS_API_BASE=https://walrus-testnet.walrus.space
```

## API Endpoints

### Model Management
- `GET /api/model` - Fetch latest model information
- `POST /api/model` - Submit gradient or create model
- `GET /api/model?version={version}` - Fetch specific model version

### Training Operations
- `POST /api/training/start` - Start training session
- `POST /api/training/submit` - Submit training results
- `GET /api/training/status` - Get training status

### Wallet Integration
- `POST /api/wallet/connect` - Connect wallet
- `POST /api/wallet/sign` - Sign transactions
- `GET /api/wallet/balance` - Get wallet balance

### Data Management
- `POST /api/data/upload` - Upload dataset
- `GET /api/data/list` - List available datasets
- `GET /api/data/download/{id}` - Download dataset

## How It Works

### 1. Model Creation
Model creators deploy smart contracts to the Sui blockchain that define the AI model architecture, training parameters, and reward mechanisms.

### 2. Data Contribution
Data owners contribute encrypted gradients or processed features to the training process without exposing raw data, using privacy-preserving techniques.

### 3. Federated Training
The platform orchestrates federated learning across multiple participants, aggregating gradients securely while maintaining data privacy.

### 4. Model Validation
Trained models undergo validation through oracle networks and zero-knowledge proofs to ensure integrity and performance.

### 5. Marketplace Listing
Validated models are listed on the decentralized marketplace where they can be purchased, licensed, or used for inference.

### 6. Reward Distribution
Contributors receive automated rewards based on their contributions to the training process, distributed via smart contracts.

## CI/CD Pipeline

Our CI/CD pipeline ensures code quality, automated testing, and seamless deployment:

### Continuous Integration
1. **Code Quality Checks**
   - ESLint for code linting
   - Prettier for code formatting
   - TypeScript compilation verification

2. **Automated Testing**
   - Unit tests with Jest
   - Integration tests for critical components
   - End-to-end tests for user flows

3. **Security Scanning**
   - Dependency vulnerability checks
   - Static code analysis
   - Security best practice validation

### Continuous Deployment
1. **Staging Environment**
   - Automatic deployment on pull request merge
   - Smoke tests to verify deployment
   - Performance monitoring

2. **Production Deployment**
   - Manual approval for production releases
   - Blue-green deployment strategy
   - Rollback capabilities

### Pipeline Configuration
The pipeline is configured using GitHub Actions with the following workflow files:
- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/cd-staging.yml` - Staging deployment
- `.github/workflows/cd-production.yml` - Production deployment

## Screenshots

[//]: # (Screenshots will be added here)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support, questions, or collaboration opportunities, please reach out to the development team.