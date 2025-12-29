# Sui-DAT Smart Contracts

This directory contains all the smart contracts for the Sui-DAT platform.

## Structure

- [sui-dat/](sui-dat/) - Main Sui Move contracts for the Sui-DAT platform

## Overview

The Sui-DAT smart contracts enable decentralized AI model training by providing:

1. **Model Management**: Track AI model versions and weights stored on Walrus
2. **Contributor System**: Manage participant reputation and contributions
3. **Gradient Aggregation**: Coordinate decentralized training across participants

## Deployment

To deploy the contracts:

1. Navigate to the contract package directory:
   ```bash
   cd sui-dat
   ```

2. Build the contracts:
   ```bash
   sui move build
   ```

3. Deploy the contracts:
   ```bash
   sui client publish --gas-budget 100000000
   ```

4. Initialize the required objects:
   ```bash
   # On Unix/Linux/MacOS
   ./init.sh
   
   # On Windows
   init.bat
   ```

For detailed documentation on the contracts, see [sui-dat/README.md](sui-dat/README.md).