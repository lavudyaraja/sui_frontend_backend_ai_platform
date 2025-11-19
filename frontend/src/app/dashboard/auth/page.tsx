'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WalletConnection from './components/wallet-connection';
import ApiKeys from './components/api-keys';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('wallet');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authentication</h1>
        <p className="text-muted-foreground">
          Manage your wallet connections and API keys
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletConnection />
        <ApiKeys />
      </div>
    </div>
  );
}