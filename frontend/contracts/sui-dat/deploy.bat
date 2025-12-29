@echo off
title Sui-DAT Contract Deployment

echo 🚀 Starting Sui-DAT Contract Deployment...

REM Check if sui CLI is installed
where sui >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Sui CLI could not be found. Please install Sui CLI tools first.
    pause
    exit /b 1
)

echo ✅ Sui CLI found

REM Navigate to contracts directory
cd /d "%~dp0"

echo 📦 Building contracts...
sui move build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful

echo 📤 Publishing contracts...
set /p gas_budget="Please enter gas budget (default: 100000000 MIST): "
if "%gas_budget%"=="" set gas_budget=100000000

echo Publishing with gas budget: %gas_budget% MIST
for /f "tokens=*" %%i in ('sui client publish --gas-budget %gas_budget% ^| findstr "0x[0-9a-fA-F]*"') do set package_id=%%i

echo 📦 Package ID: %package_id%

echo 📝 Updating environment variables...

REM Update frontend .env file
if exist "..\..\frontend\.env" (
    powershell -Command "(gc ..\..\frontend\.env) -replace 'NEXT_PUBLIC_SUI_DAT_PACKAGE_ID=.*', 'NEXT_PUBLIC_SUI_DAT_PACKAGE_ID=%package_id%' | Out-File -encoding ASCII ..\..\frontend\.env"
    echo ✅ Updated frontend .env with package ID
) else (
    echo ⚠️  Frontend .env file not found
)

echo 🎉 Deployment completed!
echo 📋 Next steps:
echo 1. Run the init scripts to create the registry and config objects
echo 2. Update your .env files with the object IDs
echo 3. Start the frontend and backend applications

pause