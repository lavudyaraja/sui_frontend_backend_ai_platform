#!/bin/bash

# Sui-DAT Contract Deployment Script

echo "🚀 Starting Sui-DAT Contract Deployment..."

# Check if sui CLI is installed
if ! command -v sui &> /dev/null
then
    echo "❌ Sui CLI could not be found. Please install Sui CLI tools first."
    exit 1
fi

echo "✅ Sui CLI found"

# Navigate to contracts directory
cd "$(dirname "$0")"

echo "📦 Building contracts..."
if sui move build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "📤 Publishing contracts..."
echo "Please confirm the gas budget (default: 100000000 MIST):"
read -r gas_budget
gas_budget=${gas_budget:-100000000}

echo "Publishing with gas budget: $gas_budget MIST"
publish_output=$(sui client publish --gas-budget "$gas_budget" 2>&1)
echo "$publish_output"

# Extract package ID and object IDs from the output
package_id=$(echo "$publish_output" | grep -o 'Published Objects.*' | grep -o '0x[0-9a-fA-F]*' | head -1)
echo "📦 Package ID: $package_id"

echo "📝 Updating environment variables..."

# Update frontend .env file
if [ -f "../../frontend/.env" ]; then
    sed -i.bak "s/NEXT_PUBLIC_SUI_DAT_PACKAGE_ID=.*/NEXT_PUBLIC_SUI_DAT_PACKAGE_ID=$package_id/" ../../frontend/.env
    echo "✅ Updated frontend .env with package ID"
else
    echo "⚠️  Frontend .env file not found"
fi

echo "🎉 Deployment completed!"
echo "📋 Next steps:"
echo "1. Run the init scripts to create the registry and config objects"
echo "2. Update your .env files with the object IDs"
echo "3. Start the frontend and backend applications"