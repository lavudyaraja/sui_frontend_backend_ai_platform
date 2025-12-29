'use client';

import { useState, useEffect, useCallback } from 'react';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { suiClientManager } from '@/lib/sui/client';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[WalletManager]', ...args);
  }
};

// Custom error class for wallet errors
export class WalletError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'WalletError';
  }
}

// Type definitions
export interface WalletState {
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Connected wallet address */
  address: string | null;
  /** Shortened address for display */
  shortAddress: string | null;
  /** Active wallet provider */
  provider: string | null;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface Signer {
  /** Get the connected address */
  getAddress(): Promise<string>;
  /** Sign and execute a transaction */
  signAndExecuteTransaction(transaction: Transaction): Promise<{
    digest: string;
    effects?: any;
  }>;
  /** Sign a message */
  signMessage(message: Uint8Array): Promise<{
    signature: string;
    messageBytes: string;
  }>;
}

// Wallet manager class
class WalletManager {
  private walletState: WalletState = {
    isConnected: false,
    address: null,
    shortAddress: null,
    provider: null,
    status: 'disconnected',
  };

  private stateListeners: ((state: WalletState) => void)[] = [];
  private autoConnectAttempted = false;

  constructor() {
    debugLog('Initializing WalletManager');
    this.init();
  }

  /**
   * Initialize the wallet manager
   */
  private async init() {
    // Add event listeners for wallet events
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.autoConnect();
      });
    }
  }

  /**
   * Subscribe to wallet state changes
   * @param listener Callback function to receive state updates
   * @returns Unsubscribe function
   */
  subscribe(listener: (state: WalletState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      const index = this.stateListeners.indexOf(listener);
      if (index > -1) {
        this.stateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners() {
    this.stateListeners.forEach(listener => {
      listener(this.walletState);
    });
  }

  /**
   * Update wallet state
   * @param newState Partial state update
   */
  private updateState(newState: Partial<WalletState>) {
    this.walletState = { ...this.walletState, ...newState };
    this.notifyListeners();
  }

  /**
   * Attempt to auto-connect to a previously used wallet
   */
  async autoConnect() {
    if (this.autoConnectAttempted || typeof window === 'undefined') {
      return;
    }

    debugLog('Attempting auto-connect');
    this.autoConnectAttempted = true;

    try {
      const lastProvider = localStorage.getItem('sui-dat:last-wallet-provider');
      if (lastProvider) {
        // In a real implementation, this would attempt to reconnect to the last provider
        debugLog(`Found last provider: ${lastProvider}, but auto-reconnection not implemented in this mock`);
      }
    } catch (error) {
      debugLog('Auto-connect failed:', error);
    }
  }

  /**
   * Connect to a wallet
   * @param provider Wallet provider name
   * @returns Promise resolving to connection result
   */
  async connect(provider: string = 'default'): Promise<WalletState> {
    debugLog(`Connecting to wallet with provider: ${provider}`);
    
    this.updateState({ status: 'connecting' });

    try {
      // In a real implementation, this would connect to the actual wallet provider
      // For now, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a mock address
      const mockAddress = `0x${Math.random().toString(16).substr(2, 64)}`;
      const shortAddress = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`;
      
      // Store provider for future auto-connect
      try {
        localStorage.setItem('sui-dat:last-wallet-provider', provider);
      } catch (error) {
        debugLog('Failed to store last wallet provider:', error);
      }
      
      this.updateState({
        isConnected: true,
        address: mockAddress,
        shortAddress,
        provider,
        status: 'connected',
      });
      
      debugLog('Wallet connected successfully');
      return this.walletState;
    } catch (error) {
      debugLog('Wallet connection failed:', error);
      this.updateState({ status: 'error' });
      throw new WalletError(
        `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Disconnect from the current wallet
   */
  async disconnect() {
    debugLog('Disconnecting wallet');
    
    try {
      // In a real implementation, this would disconnect from the actual wallet provider
      // For now, we'll simulate a successful disconnection
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Clear stored provider
      try {
        localStorage.removeItem('sui-dat:last-wallet-provider');
      } catch (error) {
        debugLog('Failed to clear last wallet provider:', error);
      }
      
      this.updateState({
        isConnected: false,
        address: null,
        shortAddress: null,
        provider: null,
        status: 'disconnected',
      });
      
      debugLog('Wallet disconnected successfully');
    } catch (error) {
      debugLog('Wallet disconnection failed:', error);
      this.updateState({ status: 'error' });
      throw new WalletError(
        `Failed to disconnect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get the current wallet state
   * @returns Current wallet state
   */
  getState(): WalletState {
    return { ...this.walletState };
  }

  /**
   * Get a signer for the connected wallet
   * @returns Signer object or null if not connected
   */
  getSigner(): Signer | null {
    if (!this.walletState.isConnected || !this.walletState.address) {
      return null;
    }

    return {
      getAddress: async (): Promise<string> => {
        if (!this.walletState.address) {
          throw new WalletError('No wallet connected');
        }
        return this.walletState.address;
      },

      signAndExecuteTransaction: async (transaction: Transaction): Promise<{
        digest: string;
        effects?: any;
      }> => {
        if (!this.walletState.address) {
          throw new WalletError('No wallet connected');
        }

        try {
          debugLog('Signing and executing transaction');
          
          // In a real implementation, this would sign and execute with the actual wallet
          // For now, we'll simulate a successful transaction
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockDigest = `0x${Math.random().toString(16).substr(2, 64)}`;
          
          return {
            digest: mockDigest,
          };
        } catch (error) {
          throw new WalletError(
            `Failed to sign and execute transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error
          );
        }
      },

      signMessage: async (message: Uint8Array): Promise<{
        signature: string;
        messageBytes: string;
      }> => {
        if (!this.walletState.address) {
          throw new WalletError('No wallet connected');
        }

        try {
          debugLog('Signing message');
          
          // In a real implementation, this would sign with the actual wallet
          // For now, we'll simulate a successful signature
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockSignature = `0x${Math.random().toString(16).substr(2, 128)}`;
          const messageBytes = Buffer.from(message).toString('hex');
          
          return {
            signature: mockSignature,
            messageBytes,
          };
        } catch (error) {
          throw new WalletError(
            `Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error
          );
        }
      },
    };
  }
}

// Export singleton instance
export const walletManager = new WalletManager();

// React hook for using the wallet in components
export function useWallet() {
  const [state, setState] = useState<WalletState>(walletManager.getState());
  
  useEffect(() => {
    const unsubscribe = walletManager.subscribe((newState) => {
      setState({ ...newState });
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const connect = useCallback(async (provider?: string) => {
    try {
      return await walletManager.connect(provider);
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }, []);
  
  const disconnect = useCallback(async () => {
    try {
      return await walletManager.disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  }, []);
  
  const getSigner = useCallback(() => {
    return walletManager.getSigner();
  }, []);
  
  return {
    ...state,
    connect,
    disconnect,
    getSigner,
  };
}