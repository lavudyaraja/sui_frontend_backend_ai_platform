'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/useAuthStore';
import { Wallet, Copy, ExternalLink, LogOut, Loader2, Check } from 'lucide-react';
import { FormatUtils } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function WalletButton() {
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
      window.open(`https://explorer.sui.io/address/${userAddress}`, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <Button 
        onClick={handleConnect}
        disabled={connecting}
        variant="outline"
        size="sm"
        className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="font-mono border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {userAddress ? FormatUtils.formatAddress(userAddress, 4, 4) : 'Wallet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Connected Wallet</p>
            <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
              Sui Network
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2">
          <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-900">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {FormatUtils.formatAddress(userAddress || '', 8, 8)}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                copyAddress();
              }}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            viewOnExplorer();
          }}
          className="cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            disconnectWallet();
          }}
          className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}