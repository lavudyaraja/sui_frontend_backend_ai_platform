# Deployment Guide

This guide explains how to deploy the Sui-DAT platform to GitHub and Vercel.

## Prerequisites

1. GitHub account
2. Vercel account
3. Git installed locally
4. Node.js and npm installed
5. Python 3.8+ installed

## GitHub Setup

### 1. Create a New Repository

1. Go to GitHub and create a new repository
2. Name it `sui-dat` or any preferred name
3. Do NOT initialize with a README, .gitignore, or license

### 2. Push the Code to GitHub

```bash
# Navigate to your project directory
cd d:\created-project\AI_agent

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit"

# Add the remote origin (replace with your repository URL)
git remote add origin https://github.com/your-username/sui-dat.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Vercel Setup

### 1. Frontend Deployment

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL
   - `NEXT_PUBLIC_SUI_NETWORK`: testnet
   - `NEXT_PUBLIC_WALRUS_API_ENDPOINT`: https://walrus-testnet.walrus.space
   - `NEXT_PUBLIC_WALRUS_AGGREGATOR`: https://aggregator.walrus-testnet.walrus.space
6. Click "Deploy"

### 2. Backend Deployment

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your GitHub repository (or create a separate project for backend)
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: (Leave empty - Vercel will auto-detect)
   - Output Directory: (Leave empty)
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SUI_NETWORK`: testnet
   - `SUI_RPC_URL`: https://fullnode.testnet.sui.io:443
   - `WALRUS_ENDPOINT`: http://walrus:31415
   - Any other required environment variables
6. Click "Deploy"

## GitHub Actions Configuration

The project includes GitHub Actions workflows for automated deployment:

1. `frontend-deploy.yml`: Deploys frontend to Vercel
2. `backend-deploy.yml`: Deploys backend to Vercel
3. `ci-cd.yml`: Comprehensive CI/CD pipeline

### Setting up Secrets

For GitHub Actions to work, you need to set up the following secrets in your GitHub repository:

1. Go to your repository settings
2. Click "Secrets and variables" → "Actions"
3. Add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel API token | `your_vercel_token` |
| `VERCEL_ORG_ID` | Vercel organization ID | `your_org_id` |
| `VERCEL_FRONTEND_PROJECT_ID` | Vercel frontend project ID | `your_frontend_project_id` |
| `VERCEL_BACKEND_PROJECT_ID` | Vercel backend project ID | `your_backend_project_id` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL for frontend | `https://your-backend.vercel.app` |
| `NEXT_PUBLIC_SUI_NETWORK` | Sui network | `testnet` |
| `NEXT_PUBLIC_WALRUS_API_ENDPOINT` | Walrus API endpoint | `https://walrus-testnet.walrus.space` |
| `NEXT_PUBLIC_WALRUS_AGGREGATOR` | Walrus aggregator | `https://aggregator.walrus-testnet.walrus.space` |

## Docker Deployment

### Local Development

To run the entire stack locally using Docker:

```bash
# Navigate to the project root
cd d:\created-project\AI_agent

# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Production Deployment with Docker

1. Build the images:
   ```bash
   docker-compose build
   ```

2. Run the services:
   ```bash
   docker-compose up -d
   ```

## Environment Variables

### Frontend (.env)

Create `frontend/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

### Backend (.env)

Create `backend/.env`:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/sui_dat

# Sui Blockchain Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key

# Walrus Storage Configuration
WALRUS_ENDPOINT=http://walrus:31415

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all dependencies are correctly specified in requirements.txt and package.json
2. **Environment Variables**: Make sure all required environment variables are set in Vercel
3. **Database Connections**: Verify MongoDB connection strings and network access
4. **CORS Issues**: Check CORS configuration in the backend

### Useful Commands

```bash
# Check running Docker containers
docker-compose ps

# View logs for a specific service
docker-compose logs frontend
docker-compose logs backend

# Restart a specific service
docker-compose restart backend

# Rebuild services
docker-compose build --no-cache
```

## Monitoring and Maintenance

1. **Vercel Dashboard**: Monitor deployments and logs
2. **MongoDB Atlas**: Monitor database performance (if using Atlas)
3. **Application Logs**: Check Vercel logs for errors
4. **Performance Metrics**: Monitor response times and resource usage

## Scaling

1. **Vertical Scaling**: Upgrade Vercel plan for more resources
2. **Horizontal Scaling**: Use Vercel's auto-scaling features
3. **Database Scaling**: Use MongoDB Atlas tiers for better performance
4. **Caching**: Implement Redis caching for better performance