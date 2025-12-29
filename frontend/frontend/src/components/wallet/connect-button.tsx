'use client';

import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/useAuthStore';
import { Wallet, Loader2 } from 'lucide-react';
import { JSX } from 'react';

export function ConnectButton(): JSX.Element | null {
  const { 
    isAuthenticated, 
    connecting, 
    connectWallet 
  } = useAuthStore();
  
  const handleConnect = async () => {
    await connectWallet();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={connecting}
      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-0 shadow-sm transition-all duration-200"
      size="default"
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}