@echo off
REM Sui-DAT Deployment Script for Windows
REM This script helps deploy the backend and frontend separately

echo Sui-DAT Deployment Script
echo ========================

REM Function to deploy backend
:deploy_backend
echo Deploying backend...
cd backend

REM Check if we're in a Vercel environment
if defined VERCEL (
  echo Running in Vercel environment
  REM Vercel will automatically run the app
) else (
  echo Running locally
  REM Install dependencies
  pip install -r requirements.txt
  
  REM Start the server
  uvicorn app.main:app --host 0.0.0.0 --port %PORT:8000%
)

cd ..
goto :eof

REM Function to deploy frontend
:deploy_frontend
echo Deploying frontend...
cd frontend

REM Check if we're in a Vercel environment
if defined VERCEL (
  echo Running in Vercel environment
  REM Vercel will automatically run the build
) else (
  echo Running locally
  REM Install dependencies
  npm install
  
  REM Start the development server
  npm run dev
)

cd ..
goto :eof

REM Main script logic
if "%1"=="" (
  REM Default to deploying both
  call :deploy_backend
  call :deploy_frontend
) else if "%1"=="backend" (
  call :deploy_backend
) else if "%1"=="frontend" (
  call :deploy_frontend
) else if "%1"=="both" (
  call :deploy_backend
  call :deploy_frontend
) else if "%1"=="help" (
  echo Usage: deploy.bat [backend^|frontend^|both]
  echo.
  echo Options:
  echo   backend    Deploy only the backend
  echo   frontend   Deploy only the frontend
  echo   both       Deploy both backend and frontend (default)
  echo   help       Show this help message
) else (
  echo Invalid option: %1
  echo Usage: deploy.bat [backend^|frontend^|both]
)

exit /b