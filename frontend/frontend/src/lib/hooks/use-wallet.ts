'use client';

import { useCurrentAccount, useDisconnectWallet, useConnectWallet } from '@mysten/dapp-kit';
import { NETWORK } from '@/lib/constants';

export function useWallet() {
  const account = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  const isConnected = !!account;
  const address = account?.address || null;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return {
    account,
    isConnected,
    address,
    shortAddress,
    connect,
    disconnect,
    networks: NETWORK,
  };
}