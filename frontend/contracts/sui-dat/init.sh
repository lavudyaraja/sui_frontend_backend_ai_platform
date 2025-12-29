#!/bin/bash

# Sui-DAT Contract Initialization Script

echo "🔧 Initializing Sui-DAT Contract Objects..."

# Check if sui CLI is installed
if ! command -v sui &> /dev/null
then
    echo "❌ Sui CLI could not be found. Please install Sui CLI tools first."
    exit 1
fi

echo "✅ Sui CLI found"

# Navigate to contracts directory
cd "$(dirname "$0")"

# Get package ID from environment or prompt
if [ -z "$PACKAGE_ID" ]; then
    echo "Please enter the deployed package ID:"
    read -r package_id
else
    package_id=$PACKAGE_ID
fi

echo "Using package ID: $package_id"

# Get signer address
signer=$(sui client active-address)
echo "Using signer address: $signer"

# Set configuration parameters
min_stake=1000000000  # 1 SUI in MIST
reward_per_contribution=100000000  # 0.1 SUI in MIST

echo "Creating Global Config with parameters:"
echo "  Min Stake: $min_stake MIST"
echo "  Reward per Contribution: $reward_per_contribution MIST"

# Create Global Config
echo "Creating Global Config..."
global_config_output=$(sui client call \
    --package "$package_id" \
    --module "contributor" \
    --function "create_global_config" \
    --args "$min_stake" "$reward_per_contribution" \
    --gas-budget 100000000 2>&1)

echo "$global_config_output"

# Extract Global Config object ID
global_config_id=$(echo "$global_config_output" | grep -o 'Created Objects.*' | grep -o '0x[0-9a-fA-F]*' | head -1)
echo "Global Config ID: $global_config_id"

# Create Model Registry
echo "Creating Model Registry..."
model_registry_output=$(sui client call \
    --package "$package_id" \
    --module "model" \
    --function "create_registry" \
    --gas-budget 100000000 2>&1)

echo "$model_registry_output"

# Extract Model Registry object ID
model_registry_id=$(echo "$model_registry_output" | grep -o 'Created Objects.*' | grep -o '0x[0-9a-fA-F]*' | head -1)
echo "Model Registry ID: $model_registry_id"

echo "📝 Updating environment variables..."

# Update frontend .env file
if [ -f "../../frontend/.env" ]; then
    sed -i.bak "s/NEXT_PUBLIC_GLOBAL_CONFIG_ID=.*/NEXT_PUBLIC_GLOBAL_CONFIG_ID=$global_config_id/" ../../frontend/.env
    sed -i.bak "s/NEXT_PUBLIC_MODEL_REGISTRY_ID=.*/NEXT_PUBLIC_MODEL_REGISTRY_ID=$model_registry_id/" ../../frontend/.env
    echo "✅ Updated frontend .env with object IDs"
else
    echo "⚠️  Frontend .env file not found"
fi

# Update backend .env file
if [ -f "../../backend/.env" ]; then
    sed -i.bak "s/GLOBAL_CONFIG_ID=.*/GLOBAL_CONFIG_ID=$global_config_id/" ../../backend/.env
    sed -i.bak "s/MODEL_REGISTRY_ID=.*/MODEL_REGISTRY_ID=$model_registry_id/" ../../backend/.env
    echo "✅ Updated backend .env with object IDs"
else
    echo "⚠️  Backend .env file not found"
fi

echo "🎉 Initialization completed!"
echo "📋 Created objects:"
echo "  Global Config: $global_config_id"
echo "  Model Registry: $model_registry_id"
echo "📋 Next steps:"
echo "1. Update your .env files with any missing values"
echo "2. Start the frontend and backend applications"