'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Key, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Coins,
  TrendingUp,
  Shield,
  Link2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function WalletSettings() {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const walletAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleViewOnExplorer = () => {
    window.open(`https://suiexplorer.com/address/${walletAddress}`, '_blank');
  };

  const handleViewAPIKeys = () => {
    alert('API Keys management would open here');
  };

  const walletStats = [
    { label: 'SUI Balance', value: '125.42 SUI', icon: Coins },
    { label: 'Training Rewards', value: '+24.8 SUI', icon: TrendingUp },
    { label: 'Data NFTs', value: '18 NFTs', icon: Shield },
    { label: 'Staked Amount', value: '500 SUI', icon: Coins },
  ];

  const recentTransactions = [
    { type: 'Training Reward', amount: '+5.2 SUI', time: '2 hours ago', status: 'completed', isPositive: true },
    { type: 'Data Purchase', amount: '-2.5 SUI', time: '5 hours ago', status: 'completed', isPositive: false },
    { type: 'Staking', amount: '-100 SUI', time: '1 day ago', status: 'completed', isPositive: false },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Wallet Card */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gray-700" />
                Wallet Information
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Connected wallet details and balance
              </CardDescription>
            </div>
            <Badge className="bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet Address
            </Label>
            <div className="flex gap-2">
              <Input 
                value={walletAddress} 
                readOnly 
                className="bg-gray-50 border-gray-200 font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
                className="border-gray-200 hover:bg-gray-50"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleViewOnExplorer}
                className="border-gray-200 hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Network */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Network
            </Label>
            <div className="flex items-center gap-2">
              <Input 
                value="Sui Testnet" 
                readOnly 
                className="bg-gray-50 border-gray-200"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Wallet Stats */}
          <div className="pt-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 text-sm">
              <TrendingUp className="w-4 h-4" />
              Wallet Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {walletStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Keys */}
          <div className="pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={handleViewAPIKeys}
            >
              <Key className="mr-2 h-4 w-4" />
              View API Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            Recent Transactions
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your latest wallet activity
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.isPositive ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {tx.isPositive ? (
                      <ArrowDownRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{tx.type}</p>
                    <p className="text-xs text-gray-500">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${tx.isPositive ? 'text-green-600' : 'text-orange-600'}`}>
                    {tx.amount}
                  </p>
                  <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs mt-1">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={handleViewOnExplorer}
          >
            View All Transactions
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Walrus Storage Info */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                Walrus Integration Active
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Your wallet is connected to Walrus decentralized storage with end-to-end encryption. 
                All your training data and model checkpoints are securely stored on-chain.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white text-gray-700 border border-gray-200">
                  2.4 GB Stored
                </Badge>
                <Badge className="bg-white text-gray-700 border border-gray-200">
                  142 Objects
                </Badge>
                <Badge className="bg-white text-gray-700 border border-gray-200">
                  Encrypted
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Common wallet operations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <Coins className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <TrendingUp className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <Shield className="mr-2 h-4 w-4" />
              Stake SUI
            </Button>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <Link2 className="mr-2 h-4 w-4" />
              Connect DApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}