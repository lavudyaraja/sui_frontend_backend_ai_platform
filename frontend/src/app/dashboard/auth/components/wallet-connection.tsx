'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { FormatUtils } from '@/lib/utils';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

export default function WalletConnection() {
  const { 
    isAuthenticated, 
    userAddress, 
    connecting, 
    connectWallet, 
    disconnectWallet 
  } = useAuthStore();
  
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    if (userAddress) {
      // In a real implementation, this would open the Sui explorer
      window.open(`https://explorer.sui.io/address/${userAddress}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
        <CardDescription>
          Connect your Sui wallet to participate in training
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Connected Wallet</Label>
              <div className="flex gap-2">
                <Input 
                  value={userAddress ? FormatUtils.formatAddress(userAddress) : ''} 
                  readOnly 
                />
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={viewOnExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={disconnectWallet}
              disabled={connecting}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to start participating in decentralized training
            </p>
            
            <Button 
              onClick={handleConnect}
              disabled={connecting}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}