# Wallet Components

This directory contains wallet-related components for the Sui-DAT platform, specifically designed for the Haulout Hackathon.

## Components

### 1. ConnectButton (`connect-button.tsx`)
A simple button component that allows users to connect their Sui wallet. It automatically hides when the user is already connected.

**Usage:**
```tsx
import { ConnectButton } from '@/components/wallet/connect-button';

export default function MyComponent() {
  return (
    <ConnectButton />
  );
}
```

### 2. WalletButton (`wallet-button.tsx`)
An advanced wallet button that shows the connected wallet address and provides a dropdown menu with wallet actions.

**Usage:**
```tsx
import { WalletButton } from '@/components/wallet/wallet-button';

export default function MyComponent() {
  return (
    <WalletButton />
  );
}
```

### 3. Wallet Connection Card (`wallet-connection.tsx`)
A complete card component that provides wallet connection functionality with address display and explorer links.

**Usage:**
```tsx
import WalletConnection from '@/app/(dashboard)/auth/components/wallet-connection';

export default function MyComponent() {
  return (
    <WalletConnection />
  );
}
```

## Wallet Page (`/wallet`)
A dedicated wallet dashboard page that provides:
- Wallet balance overview
- Transaction history
- Security best practices
- Wallet management tools

## Integration with Auth Store
All wallet components use the `useAuthStore` zustand store for managing authentication state:
- `isAuthenticated`: Boolean indicating if wallet is connected
- `userAddress`: Connected wallet address
- `connecting`: Boolean indicating connection in progress
- `connectWallet()`: Function to initiate wallet connection
- `disconnectWallet()`: Function to disconnect wallet

## Haulout Hackathon Features

This wallet implementation is designed to support the Haulout Hackathon requirements:

1. **Data Marketplaces Track**: Wallet integration for marketplace transactions
2. **AI x Data Track**: Wallet connection for AI training rewards
3. **Provably Authentic Track**: Wallet verification for authentic data contributions
4. **Data Security & Privacy Track**: Secure wallet management for private data

## Customization
To customize the wallet components for your specific hackathon project:

1. Modify the `connectWallet` function in `useAuthStore.ts` to integrate with actual Sui wallet providers
2. Update the transaction simulation in `wallet/page.tsx` to reflect your project's token economy
3. Customize the security recommendations in the wallet page to match your project's requirements

## Sui Integration
The current implementation simulates wallet connections. For a production implementation, integrate with Sui wallet providers like:

```ts
// Example Sui wallet integration
import { walletAccounts, switchAccount } from '@mysten/dapp-kit';

const connectWallet = async () => {
  try {
    const accounts = await walletAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      set({
        isAuthenticated: true,
        userAddress: account.address,
      });
    }
  } catch (error) {
    // Handle connection error
  }
};
```