@echo off
title Sui-DAT Contract Initialization

echo 🔧 Initializing Sui-DAT Contract Objects...

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

REM Get package ID from environment or prompt
if "%PACKAGE_ID%"=="" (
    set /p package_id="Please enter the deployed package ID: "
) else (
    set package_id=%PACKAGE_ID%
)

echo Using package ID: %package_id%

REM Get signer address
for /f "tokens=*" %%i in ('sui client active-address') do set signer=%%i
echo Using signer address: %signer%

REM Set configuration parameters
set min_stake=1000000000
set reward_per_contribution=100000000

echo Creating Global Config with parameters:
echo   Min Stake: %min_stake% MIST
echo   Reward per Contribution: %reward_per_contribution% MIST

echo Creating Global Config...
for /f "tokens=*" %%i in ('sui client call --package "%package_id%" --module "contributor" --function "create_global_config" --args "%min_stake%" "%reward_per_contribution%" --gas-budget 100000000 ^| findstr "0x[0-9a-fA-F]*"') do set global_config_id=%%i

echo Global Config ID: %global_config_id%

echo Creating Model Registry...
for /f "tokens=*" %%i in ('sui client call --package "%package_id%" --module "model" --function "create_registry" --gas-budget 100000000 ^| findstr "0x[0-9a-fA-F]*"') do set model_registry_id=%%i

echo Model Registry ID: %model_registry_id%

echo 📝 Updating environment variables...

REM Update frontend .env file
if exist "..\..\frontend\.env" (
    powershell -Command "(gc ..\..\frontend\.env) -replace 'NEXT_PUBLIC_GLOBAL_CONFIG_ID=.*', 'NEXT_PUBLIC_GLOBAL_CONFIG_ID=%global_config_id%' | Out-File -encoding ASCII ..\..\frontend\.env"
    powershell -Command "(gc ..\..\frontend\.env) -replace 'NEXT_PUBLIC_MODEL_REGISTRY_ID=.*', 'NEXT_PUBLIC_MODEL_REGISTRY_ID=%model_registry_id%' | Out-File -encoding ASCII ..\..\frontend\.env"
    echo ✅ Updated frontend .env with object IDs
) else (
    echo ⚠️  Frontend .env file not found
)

REM Update backend .env file
if exist "..\..\backend\.env" (
    powershell -Command "(gc ..\..\backend\.env) -replace 'GLOBAL_CONFIG_ID=.*', 'GLOBAL_CONFIG_ID=%global_config_id%' | Out-File -encoding ASCII ..\..\backend\.env"
    powershell -Command "(gc ..\..\backend\.env) -replace 'MODEL_REGISTRY_ID=.*', 'MODEL_REGISTRY_ID=%model_registry_id%' | Out-File -encoding ASCII ..\..\backend\.env"
    echo ✅ Updated backend .env with object IDs
) else (
    echo ⚠️  Backend .env file not found
)

echo 🎉 Initialization completed!
echo 📋 Created objects:
echo   Global Config: %global_config_id%
echo   Model Registry: %model_registry_id%
echo 📋 Next steps:
echo 1. Update your .env files with any missing values
echo 2. Start the frontend and backend applications

pause