# Frontend Deployment Guide

This guide explains how to deploy the Sui-DAT frontend independently to Vercel or other hosting platforms.

## Prerequisites

1. Vercel account (for Vercel deployment)
2. Node.js 16+ installed
3. npm, yarn, or pnpm package manager

## Vercel Deployment

### 1. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Select the repository containing the frontend code (or import the frontend folder separately)
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `/` (if deploying from the frontend directory) or `/frontend` (if deploying from root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (see Environment Variables section below)
6. Click "Deploy"

### 2. Environment Variables

For the frontend to work correctly, you need to set the following environment variables in your Vercel project:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://your-backend.vercel.app` |
| `NEXT_PUBLIC_SUI_NETWORK` | Sui network | `testnet` |
| `NEXT_PUBLIC_WALRUS_API_ENDPOINT` | Walrus API endpoint | `https://walrus-testnet.walrus.space` |
| `NEXT_PUBLIC_WALRUS_AGGREGATOR` | Walrus aggregator | `https://aggregator.walrus-testnet.walrus.space` |

## Docker Deployment

### 1. Build Docker Image

```bash
# Navigate to the frontend directory
cd frontend

# Build the Docker image
docker build -t sui-dat-frontend .
```

### 2. Run with Docker

```bash
# Run the container with environment variables
docker run -d \
  --name sui-dat-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL="http://host.docker.internal:8000" \
  -e NEXT_PUBLIC_SUI_NETWORK="testnet" \
  -e NEXT_PUBLIC_WALRUS_API_ENDPOINT="https://walrus-testnet.walrus.space" \
  -e NEXT_PUBLIC_WALRUS_AGGREGATOR="https://aggregator.walrus-testnet.walrus.space" \
  sui-dat-frontend
```

## Local Deployment

### 1. Install Dependencies

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the frontend directory with the required environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

### 3. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Health Check

After deployment, you can verify that the frontend is running correctly by accessing the root URL in your browser:

```
http://your-frontend-url/
```

## Custom Domain

To use a custom domain with Vercel:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain
4. Follow the instructions to configure DNS records

## Environment-Specific Configurations

### Development Environment

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

### Production Environment

```env
NEXT_PUBLIC_BACKEND_URL=https://your-production-backend.com
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-mainnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-mainnet.walrus.space
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend is configured to accept requests from your frontend domain
2. **Environment Variables**: Verify all required environment variables are set correctly
3. **Build Failures**: Check that all dependencies are correctly installed
4. **API Connection**: Ensure the backend URL is accessible from the frontend

### Useful Commands

```bash
# Check for linting errors
npm run lint

# Run tests
npm run test

# Build the application
npm run build

# Start production server
npm start

# View application logs
docker logs sui-dat-frontend
```

## Performance Optimization

For production deployments, consider:

1. **Image Optimization**: Use Next.js Image component for optimized images
2. **Code Splitting**: Leverage Next.js automatic code splitting
3. **Caching**: Implement proper caching headers
4. **CDN**: Use Vercel's global CDN for content delivery
5. **Compression**: Enable gzip/brotli compression

## Monitoring

Set up monitoring for your frontend deployment:

1. **Vercel Analytics**: Built-in analytics with Vercel deployments
2. **Error Tracking**: Integrate with Sentry or similar error tracking services
3. **Performance Monitoring**: Use tools like Lighthouse or Web Vitals