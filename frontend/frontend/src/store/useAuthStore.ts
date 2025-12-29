import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userAddress: string | null;
  userReputation: number | null;
  connecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateReputation: (reputation: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userAddress: null,
      userReputation: null,
      connecting: false,
      error: null,
      
      connectWallet: async () => {
        set({ connecting: true, error: null });
        
        try {
          // In a real implementation, this would connect to the Sui wallet
          // For now, we'll simulate a successful connection
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            isAuthenticated: true,
            userAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            connecting: false,
          });
        } catch (error) {
          set({
            connecting: false,
            error: error instanceof Error ? error.message : 'Failed to connect wallet',
          });
        }
      },
      
      disconnectWallet: () => {
        set({
          isAuthenticated: false,
          userAddress: null,
          userReputation: null,
        });
      },
      
      updateReputation: (reputation) => {
        set({ userReputation: reputation });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);