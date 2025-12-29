'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/store/useAuthStore';
import { Wallet, Coins, ShoppingCart } from 'lucide-react';
import { FormatUtils } from '@/lib/utils';

interface PurchaseData {
  datasetId: string;
  price: number;
  token: 'SUI' | 'DAT';
}

export function DataMarketplaceWallet() {
  const { 
    isAuthenticated, 
    userAddress, 
    connectWallet 
  } = useAuthStore();
  
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({
    datasetId: '',
    price: 0,
    token: 'SUI'
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{success: boolean; message: string} | null>(null);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setPurchaseResult({ success: false, message: 'Please connect your wallet first' });
      return;
    }

    if (!purchaseData.datasetId || purchaseData.price <= 0) {
      setPurchaseResult({ success: false, message: 'Please enter valid purchase details' });
      return;
    }

    setIsPurchasing(true);
    setPurchaseResult(null);

    try {
      // In a real implementation, this would:
      // 1. Call the wallet API to initiate the transfer
      // 2. Interact with the data marketplace smart contract
      // 3. Handle the transaction signing process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPurchaseResult({
        success: true,
        message: `Successfully purchased dataset for ${purchaseData.price} ${purchaseData.token}`
      });
      
      // Reset form
      setPurchaseData({
        datasetId: '',
        price: 0,
        token: 'SUI'
      });
    } catch (error) {
      setPurchaseResult({
        success: false,
        message: 'Purchase failed. Please try again.'
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Required
          </CardTitle>
          <CardDescription>
            Connect your wallet to purchase datasets from the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectWallet} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Data Marketplace Wallet
        </CardTitle>
        <CardDescription>
          Purchase datasets using your connected wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Connected Wallet</span>
          </div>
          <span className="font-mono text-sm">
            {userAddress ? FormatUtils.formatAddress(userAddress, 6, 4) : 'Not connected'}
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="datasetId">Dataset ID</Label>
          <Input
            id="datasetId"
            placeholder="Enter dataset ID"
            value={purchaseData.datasetId}
            onChange={(e) => setPurchaseData({...purchaseData, datasetId: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={purchaseData.price || ''}
              onChange={(e) => setPurchaseData({...purchaseData, price: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <select
              id="token"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={purchaseData.token}
              onChange={(e) => setPurchaseData({...purchaseData, token: e.target.value as 'SUI' | 'DAT'})}
            >
              <option value="SUI">SUI</option>
              <option value="DAT">DAT</option>
            </select>
          </div>
        </div>

        <Button 
          onClick={handlePurchase} 
          disabled={isPurchasing}
          className="w-full"
        >
          {isPurchasing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Processing Purchase...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Purchase Dataset
            </>
          )}
        </Button>

        {purchaseResult && (
          <div className={`p-3 rounded-lg ${purchaseResult.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <p className={`text-sm ${purchaseResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {purchaseResult.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}