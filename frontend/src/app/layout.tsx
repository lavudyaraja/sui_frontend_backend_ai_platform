'use client';

import './globals.css';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from '@/context/theme-provider';
import { SettingsProvider } from '@/context/settings-provider';

// Simplified font handling to avoid build issues
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Sui-DAT - Decentralized AI Training Platform</title>
        <meta name="description" content="Decentralized AI training platform built on Sui and Walrus" />
      </head>
      <body className="antialiased bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networks} defaultNetwork="testnet">
            
            {/* 🔥 IMPORTANT FIX → autoConnect added */}
            <WalletProvider autoConnect={true}>
              
              <ThemeProvider>
                <SettingsProvider>
                  {children}
                </SettingsProvider>
              </ThemeProvider>

            </WalletProvider>

          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}