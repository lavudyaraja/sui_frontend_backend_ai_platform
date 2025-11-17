@echo off
echo Starting Sui-DAT Backend...
echo Make sure MongoDB is running before starting the backend.
echo To start MongoDB, run start_mongodb.bat
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload