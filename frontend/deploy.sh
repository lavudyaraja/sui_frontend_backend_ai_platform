#!/bin/bash

# Sui-DAT Deployment Script
# This script helps deploy the backend and frontend separately

echo "Sui-DAT Deployment Script"
echo "========================"

# Function to deploy backend
deploy_backend() {
  echo "Deploying backend..."
  cd backend
  
  # Check if we're in a Vercel environment
  if [ -n "$VERCEL" ]; then
    echo "Running in Vercel environment"
    # Vercel will automatically run the app
  else
    echo "Running locally"
    # Install dependencies
    pip install -r requirements.txt
    
    # Start the server
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
  fi
  
  cd ..
}

# Function to deploy frontend
deploy_frontend() {
  echo "Deploying frontend..."
  cd frontend
  
  # Check if we're in a Vercel environment
  if [ -n "$VERCEL" ]; then
    echo "Running in Vercel environment"
    # Vercel will automatically run the build
  else
    echo "Running locally"
    # Install dependencies
    npm install
    
    # Start the development server
    npm run dev
  fi
  
  cd ..
}

# Function to show help
show_help() {
  echo "Usage: ./deploy.sh [backend|frontend|both]"
  echo ""
  echo "Options:"
  echo "  backend    Deploy only the backend"
  echo "  frontend   Deploy only the frontend"
  echo "  both       Deploy both backend and frontend (default)"
  echo "  help       Show this help message"
}

# Main script logic
case "${1:-both}" in
  backend)
    deploy_backend
    ;;
  frontend)
    deploy_frontend
    ;;
  both)
    deploy_backend &
    deploy_frontend
    ;;
  help)
    show_help
    ;;
  *)
    echo "Invalid option: $1"
    show_help
    exit 1
    ;;
esac