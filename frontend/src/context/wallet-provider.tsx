'use client';

import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useCurrentAccount, useDisconnectWallet, useConnectWallet } from '@mysten/dapp-kit';

// Network configuration
export const NETWORK = {
  MAINNET: 'testnet',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
  LOCALNET: 'localnet',
} as const;

type NetworkType = typeof NETWORK[keyof typeof NETWORK];

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  shortAddress: string | null;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  
  // Network info
  currentNetwork: NetworkType;
  networks: typeof NETWORK;
  
  // Account data
  publicKey: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const account = useCurrentAccount();
  const { mutate: connectWallet, isPending: isConnecting } = useConnectWallet();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(NETWORK.MAINNET);

  // Get wallet address
  const address = account?.address || null;
  
  // Format short address
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  // Get public key
  const publicKey = account?.publicKey ? 
    Array.from(account.publicKey).map(b => b.toString(16).padStart(2, '0')).join('') 
    : null;

  // Connection state
  const isConnected = !!account?.address;

  // Connect wallet handler
  const connect = useCallback(() => {
    try {
      // @ts-ignore - Workaround for type issue
      connectWallet(undefined);
    } catch (error) {
      console.error('Connect error:', error);
    }
  }, [connectWallet]);

  // Disconnect wallet handler
  const disconnect = useCallback(() => {
    try {
      disconnectWallet();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, [disconnectWallet]);

  // Detect network changes (if available in account data)
  useEffect(() => {
    // You can implement network detection logic here based on your setup
    // For now, defaulting to testnet
    setCurrentNetwork(NETWORK.MAINNET);
  }, [account]);

  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      console.log('Wallet connected:', {
        address: shortAddress,
        network: currentNetwork
      });
    } else {
      console.log('Wallet disconnected');
    }
  }, [isConnected, shortAddress, currentNetwork]);

  const value: WalletContextType = {
    isConnected,
    isConnecting,
    address,
    shortAddress,
    connect,
    disconnect,
    currentNetwork,
    networks: NETWORK,
    publicKey,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWalletContext() {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  
  return context;
}

// Optional: Export individual hooks for specific features
export function useWalletAddress() {
  const { address, shortAddress } = useWalletContext();
  return { address, shortAddress };
}

export function useWalletConnection() {
  const { isConnected, isConnecting, connect, disconnect } = useWalletContext();
  return { isConnected, isConnecting, connect, disconnect };
}

export function useWalletNetwork() {
  const { currentNetwork, networks } = useWalletContext();
  return { currentNetwork, networks };
}