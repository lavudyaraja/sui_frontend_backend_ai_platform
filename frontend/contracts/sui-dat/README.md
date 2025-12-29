# Sui-DAT Smart Contracts

This directory contains the Move smart contracts for the Sui-DAT (Sui Decentralized AI Training) platform.

## Overview

The Sui-DAT platform uses Sui blockchain to enable decentralized AI model training with the following key components:

1. **Model Management**: Track AI model versions and weights stored on Walrus
2. **Contributor System**: Manage participant reputation and contributions
3. **Gradient Aggregation**: Coordinate decentralized training across participants

## Contract Modules

### 1. Model Module (`model.move`)

Manages AI model versions and training workflow:

- **Model Registry**: Central registry storing all model versions
- **Model Objects**: Individual model versions with metadata
- **Gradient Submissions**: Track contributions from participants
- **Aggregation Workflow**: Coordinate gradient aggregation process

Key functions:
- `create_model`: Create a new model version
- `submit_gradient`: Submit training gradients
- `finalize_aggregation`: Update model with new weights after aggregation
- `get_model_by_version`: Retrieve model information
- `get_pending_gradients`: Get gradients waiting for aggregation

### 2. Contributor Module (`contributor.move`)

Manages participant reputation and contribution tracking:

- **Global Configuration**: System-wide settings and admin controls
- **Contributor Records**: Individual participant statistics
- **Reputation System**: Track and reward quality contributions

Key functions:
- `create_global_config`: Initialize system configuration
- `award_reputation`: Reward contributors for quality work
- `get_contributor`: Retrieve contributor information
- `update_contributor_after_contribution`: Update stats after successful contribution

## Deployment

### Prerequisites

1. Install Sui CLI tools
2. Have a funded Sui wallet

### Steps

1. Navigate to the contracts directory:
   ```bash
   cd contracts/sui-dat
   ```

2. Build the contracts:
   ```bash
   sui move build
   ```

3. Deploy the contracts:
   ```bash
   sui client publish --gas-budget 100000000
   ```

4. Note the package ID and object IDs from the deployment output

### Environment Configuration

After deployment, update your frontend and backend environment variables:

```env
# Frontend (.env)
NEXT_PUBLIC_SUI_DAT_PACKAGE_ID=<your_package_id>
NEXT_PUBLIC_GLOBAL_CONFIG_ID=<global_config_object_id>
NEXT_PUBLIC_MODEL_REGISTRY_ID=<model_registry_object_id>

# Backend (.env)
SUI_PACKAGE_ID=<your_package_id>
GLOBAL_CONFIG_ID=<global_config_object_id>
MODEL_REGISTRY_ID=<model_registry_object_id>
```

## Testing

Run Move unit tests:
```bash
sui move test
```

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Participant   │    │   Sui-DAT Core   │    │   Walrus Storage│
│                 │    │                  │    │                 │
│  Submit         │    │  Model Registry  │    │  Model Weights  │
│  Gradients ◄───►│◄──►│  ◄─────────────► │◄──►│  & Gradients    │
│                 │    │                  │    │                 │
│  Receive        │    │  Contributor     │    │                 │
│  Rewards ◄──────┼───►│  Management      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Security Considerations

- Only authorized addresses can finalize model aggregations
- Reputation system helps identify quality contributors
- All model weights and gradients are stored off-chain on Walrus
- On-chain only stores metadata and coordination data