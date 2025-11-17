# Backend Deployment Guide

This guide explains how to deploy the Sui-DAT backend independently to Vercel or other cloud platforms.

## Prerequisites

1. Vercel account (for Vercel deployment)
2. MongoDB database (local, Atlas, or other provider)
3. Python 3.8+ (for local deployment)

## Vercel Deployment

### 1. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Select the repository containing the backend code (or import the backend folder separately)
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: `/` (if deploying from the backend directory) or `/backend` (if deploying from root)
   - Build Command: (Leave empty - Vercel will auto-detect)
   - Output Directory: (Leave empty)
5. Add environment variables (see Environment Variables section below)
6. Click "Deploy"

### 2. Environment Variables

For the backend to work correctly, you need to set the following environment variables in your Vercel project:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/sui_dat` |
| `SUI_NETWORK` | Sui network | `testnet` |
| `SUI_RPC_URL` | Sui RPC endpoint | `https://fullnode.testnet.sui.io:443` |
| `CONTRACT_ADDRESS` | Sui contract address | `0x...` |
| `PRIVATE_KEY` | Sui private key | `your_private_key` |
| `WALRUS_ENDPOINT` | Walrus storage endpoint | `http://localhost:31415` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | `sk-...` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `ENVIRONMENT` | Environment | `production` |

## Docker Deployment

### 1. Build Docker Image

```bash
# Navigate to the backend directory
cd backend

# Build the Docker image
docker build -t sui-dat-backend .
```

### 2. Run with Docker

```bash
# Run the container with environment variables
docker run -d \
  --name sui-dat-backend \
  -p 8000:8000 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/sui_dat" \
  -e SUI_NETWORK="testnet" \
  -e SUI_RPC_URL="https://fullnode.testnet.sui.io:443" \
  -e WALRUS_ENDPOINT="http://host.docker.internal:31415" \
  sui-dat-backend
```

### 3. Docker Compose

If you want to run the backend with its dependencies using Docker Compose:

```bash
# From the root directory
docker-compose up -d backend mongodb redis
```

## Local Deployment

### 1. Install Dependencies

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the backend directory with the required environment variables:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

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

### 3. Run the Application

```bash
# Run with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Or run directly with Python
python -m app.main
```

## Health Check

After deployment, you can verify that the backend is running correctly by accessing the health check endpoint:

```
GET /health
```

This should return a JSON response with status information.

## API Documentation

The backend provides interactive API documentation:

- **Swagger UI**: `http://your-backend-url/docs`
- **ReDoc**: `http://your-backend-url/redoc`

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your MongoDB URI is correct and the database is accessible
2. **Environment Variables**: Verify all required environment variables are set
3. **Port Conflicts**: Make sure the port (default 8000) is available
4. **Dependencies**: Ensure all dependencies in requirements.txt are installed

### Useful Commands

```bash
# Check if MongoDB is accessible
python check_mongodb.py

# Test MongoDB integration
python test_mongodb_integration.py

# Check backend health
curl http://localhost:8000/health

# View application logs
docker logs sui-dat-backend
```

## Scaling

For production deployments, consider:

1. **Load Balancing**: Use a load balancer to distribute traffic
2. **Database Scaling**: Use MongoDB Atlas or a managed MongoDB service
3. **Caching**: Implement Redis caching for better performance
4. **Monitoring**: Set up monitoring and alerting for your deployment