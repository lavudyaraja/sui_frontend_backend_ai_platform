'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Shield,
  TrendingUp,
  Database,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { FormatUtils } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'reward' | 'marketplace';
  amount: number;
  from?: string;
  to?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

export default function WalletPage() {
  const { 
    isAuthenticated, 
    userAddress, 
    connecting, 
    connectWallet, 
    disconnectWallet 
  } = useAuthStore();
  
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(0);
  const [dataTokens, setDataTokens] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
    }
  }, [isAuthenticated]);

  const fetchWalletData = async () => {
    // Simulate fetching wallet balance and transactions
    setBalance(parseFloat((Math.random() * 100 + 50).toFixed(2)));
    setDataTokens(parseFloat((Math.random() * 500 + 100).toFixed(0)));
    
    // Simulate recent transactions with hackathon-relevant types
    setTransactions([
      {
        id: '1',
        type: 'reward',
        amount: 25.5,
        from: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
        timestamp: new Date(Date.now() - 3600000),
        status: 'completed',
        description: 'AI Training Contribution Reward'
      },
      {
        id: '2',
        type: 'marketplace',
        amount: 12.3,
        to: '0x9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4f3c2b1a0f',
        timestamp: new Date(Date.now() - 86400000),
        status: 'completed',
        description: 'Dataset Purchase: Medical Imaging Data'
      },
      {
        id: '3',
        type: 'received',
        amount: 50.0,
        from: '0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
        timestamp: new Date(Date.now() - 172800000),
        status: 'completed',
        description: 'Data Validation Payment'
      },
      {
        id: '4',
        type: 'sent',
        amount: 8.7,
        to: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
        timestamp: new Date(Date.now() - 259200000),
        status: 'completed',
        description: 'Walrus Storage Fee'
      }
    ]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWalletData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
      window.open(`https://explorer.sui.io/address/${userAddress}`, '_blank');
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'received':
      case 'reward':
        return <ArrowDownRight className="h-4 w-4" />;
      case 'sent':
      case 'marketplace':
        return <ArrowUpRight className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'received':
      case 'reward':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50';
      case 'sent':
      case 'marketplace':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50';
    }
  };

  const totalReceived = transactions
    .filter(tx => tx.type === 'received' || tx.type === 'reward')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSent = transactions
    .filter(tx => tx.type === 'sent' || tx.type === 'marketplace')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Wallet
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Manage your SUI tokens, DATA tokens, and track your marketplace activity
        </p>
      </div>

      {!isAuthenticated ? (
        <Card className="max-w-md mx-auto border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Wallet</CardTitle>
            <CardDescription>
              Connect your Sui wallet to participate in the decentralized data marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Access data marketplaces, earn rewards for AI training contributions, 
                and manage your digital assets securely on the Sui blockchain.
              </p>
            </div>
            
            <Button 
              onClick={handleConnect}
              disabled={connecting}
              className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wallet Overview */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Wallet Overview</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-8"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <CardDescription>
                Your token balances and wallet information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/50">
                      <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <Badge variant="secondary" className="text-xs">SUI</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{balance.toFixed(2)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    SUI Balance
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-950/50">
                      <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="secondary" className="text-xs">DATA</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{dataTokens}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    DATA Tokens
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
                      <ArrowDownRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                        Total Received
                      </p>
                      <p className="text-lg font-bold">{totalReceived.toFixed(2)} SUI</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/50">
                      <ArrowUpRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                        Total Spent
                      </p>
                      <p className="text-lg font-bold">{totalSent.toFixed(2)} SUI</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                        Transactions
                      </p>
                      <p className="text-lg font-bold">{transactions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Wallet Address */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input 
                    value={userAddress ? FormatUtils.formatAddress(userAddress) : ''} 
                    readOnly 
                    className="font-mono text-sm bg-slate-50 dark:bg-slate-900/50"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyAddress}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={viewOnExplorer}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Address copied to clipboard!
                  </p>
                )}
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  onClick={disconnectWallet}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Disconnect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <CardDescription>
                Your latest marketplace and wallet activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${getTransactionColor(tx.type)}`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">
                          {tx.description || `${tx.type === 'received' ? 'Received' : 'Sent'} ${tx.amount} SUI`}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                          {tx.type === 'received' || tx.type === 'reward'
                            ? `From: ${FormatUtils.formatAddress(tx.from || '')}` 
                            : `To: ${FormatUtils.formatAddress(tx.to || '')}`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className={`font-bold text-sm ${
                        tx.type === 'received' || tx.type === 'reward' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.type === 'received' || tx.type === 'reward' ? '+' : '-'}{tx.amount} SUI
                      </p>
                      <Badge 
                        variant={tx.status === 'completed' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Security Best Practices */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Best Practices
              </CardTitle>
              <CardDescription>
                Protect your wallet and digital assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Backup Your Wallet</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Always backup your wallet recovery phrase and store it in a secure, offline location. 
                    Never share it with anyone or store it digitally.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Verify Transactions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Always verify transaction details before signing. Check recipient addresses and 
                    amounts carefully to prevent sending funds to the wrong destination.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Use Official Platforms</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Only use official Sui wallets and verified dApps. Verify URLs and app authenticity 
                    before connecting your wallet or signing transactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}