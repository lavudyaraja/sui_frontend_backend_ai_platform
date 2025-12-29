import { NextRequest, NextResponse } from 'next/server';

/**
 * Wallet API Route for Haulout Hackathon
 * 
 * Endpoints for wallet-related functionality:
 * - Wallet balance (SUI and DATA tokens)
 * - Transaction history
 * - Reward distribution from AI training
 * - Data marketplace transactions
 * - Walrus storage payments
 */

interface WalletBalance {
  address: string;
  suiBalance: number;
  dataTokenBalance: number;
  stakedAmount: number;
  totalEarned: number;
  totalSpent: number;
}

interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'reward' | 'marketplace' | 'staked' | 'unstaked' | 'storage';
  amount: number;
  token: 'SUI' | 'DATA';
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  from?: string;
  to?: string;
  description?: string;
  txHash?: string;
  walrusStorageId?: string;
}

interface DataMarketplacePurchase {
  datasetId: string;
  datasetName: string;
  price: number;
  token: 'SUI' | 'DATA';
  seller: string;
  walrusStorageId: string;
  purchaseDate: string;
}

// Mock data for demonstration
const mockBalances: Record<string, WalletBalance> = {
  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12': {
    address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    suiBalance: 125.75,
    dataTokenBalance: 2450,
    stakedAmount: 250,
    totalEarned: 450.50,
    totalSpent: 324.75
  },
  '0x9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4f3c2b1a0f': {
    address: '0x9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4f3c2b1a0f',
    suiBalance: 68.25,
    dataTokenBalance: 1850,
    stakedAmount: 100,
    totalEarned: 250.00,
    totalSpent: 181.75
  }
};

const mockTransactions: Record<string, Transaction[]> = {
  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12': [
    {
      id: 'tx-1',
      type: 'reward',
      amount: 25.5,
      token: 'SUI',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
      from: '0xreward-contract',
      description: 'AI Training Contribution Reward',
      txHash: '0xabcd1234efgh5678ijkl9012mnop3456'
    },
    {
      id: 'tx-2',
      type: 'marketplace',
      amount: 12.3,
      token: 'SUI',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
      to: '0xdata-marketplace-contract',
      description: 'Dataset Purchase: Medical Imaging Data',
      txHash: '0xqrst7890uvwx1234yzab5678cdef9012',
      walrusStorageId: 'walrus://dataset-medical-imaging-001'
    },
    {
      id: 'tx-3',
      type: 'received',
      amount: 50.0,
      token: 'DATA',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
      from: '0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
      description: 'Data Validation Payment',
      txHash: '0xghij3456klmn7890opqr1234stuv5678'
    },
    {
      id: 'tx-4',
      type: 'storage',
      amount: 2.5,
      token: 'SUI',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'completed',
      to: '0xwalrus-storage-contract',
      description: 'Walrus Storage Fee - 100GB',
      txHash: '0xwxyz9012abcd3456efgh7890ijkl1234'
    },
    {
      id: 'tx-5',
      type: 'staked',
      amount: 100.0,
      token: 'SUI',
      timestamp: new Date(Date.now() - 604800000).toISOString(),
      status: 'completed',
      to: '0xstaking-contract',
      description: 'Staked SUI for Network Security',
      txHash: '0xmnop5678qrst9012uvwx3456yzab7890'
    }
  ]
};

/**
 * GET /api/wallet
 * Get comprehensive wallet information
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wallet address is required',
        code: 'MISSING_ADDRESS'
      },
      { status: 400 }
    );
  }

  try {
    // In production, you would:
    // 1. Validate the wallet address format
    // 2. Query Sui blockchain via RPC for actual balances
    // 3. Retrieve transaction history from indexed data (Sui RPC or indexer)
    // 4. Query Walrus storage for stored data info
    // 5. Check staking contracts for staked amounts
    
    const balance = mockBalances[address] || {
      address,
      suiBalance: 0,
      dataTokenBalance: 0,
      stakedAmount: 0,
      totalEarned: 0,
      totalSpent: 0
    };
    
    const transactions = mockTransactions[address] || [];

    // Calculate additional stats
    const rewardTransactions = transactions.filter(tx => tx.type === 'reward');
    const totalRewards = rewardTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    const marketplaceTransactions = transactions.filter(tx => tx.type === 'marketplace');
    const totalMarketplaceSpent = marketplaceTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        balance,
        transactions,
        stats: {
          totalRewards,
          totalMarketplaceSpent,
          transactionCount: transactions.length,
          rewardCount: rewardTransactions.length,
          marketplacePurchases: marketplaceTransactions.length
        }
      }
    });

  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch wallet data',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/transfer
 * Execute a token transfer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, amount, token, description } = body;

    // Validate inputs
    if (!from || !to || !amount || !token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: from, to, amount, token',
          code: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Amount must be greater than 0',
          code: 'INVALID_AMOUNT'
        },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Verify the sender's wallet signature
    // 2. Check sufficient balance in the wallet
    // 3. Create and sign a Sui transaction
    // 4. Submit transaction to Sui blockchain
    // 5. Wait for transaction confirmation
    // 6. Return transaction hash and status

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'sent',
      amount,
      token: token as 'SUI' | 'DATA',
      timestamp: new Date().toISOString(),
      status: 'completed',
      from,
      to,
      description: description || 'Transfer',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    return NextResponse.json({
      success: true,
      data: {
        transaction,
        message: 'Transfer completed successfully',
        explorerUrl: `https://explorer.sui.io/txblock/${transaction.txHash}`
      }
    });

  } catch (error) {
    console.error('Wallet transfer error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process transfer',
        code: 'TRANSFER_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/marketplace/purchase
 * Purchase a dataset from the marketplace
 */
export async function PURCHASE(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyer, datasetId, price, token, walrusStorageId } = body;

    if (!buyer || !datasetId || !price || !token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          code: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    // In production for Haulout Hackathon:
    // 1. Verify buyer has sufficient balance
    // 2. Call marketplace smart contract
    // 3. Transfer payment to seller
    // 4. Grant access to Walrus-stored data
    // 5. Update ownership records on Sui
    // 6. Emit marketplace event

    await new Promise(resolve => setTimeout(resolve, 2000));

    const purchase: DataMarketplacePurchase = {
      datasetId,
      datasetName: 'AI Training Dataset',
      price,
      token: token as 'SUI' | 'DATA',
      seller: '0x' + Math.random().toString(16).substr(2, 40),
      walrusStorageId: walrusStorageId || `walrus://dataset-${datasetId}`,
      purchaseDate: new Date().toISOString()
    };

    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'marketplace',
      amount: price,
      token: token as 'SUI' | 'DATA',
      timestamp: new Date().toISOString(),
      status: 'completed',
      from: buyer,
      to: '0xmarketplace-contract',
      description: `Dataset Purchase: ${datasetId}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      walrusStorageId: purchase.walrusStorageId
    };

    return NextResponse.json({
      success: true,
      data: {
        purchase,
        transaction,
        message: 'Dataset purchased successfully',
        accessInfo: {
          walrusStorageId: purchase.walrusStorageId,
          downloadUrl: `https://walrus-storage.sui.io/download/${datasetId}`,
          expiresAt: null // Permanent access
        }
      }
    });

  } catch (error) {
    console.error('Marketplace purchase error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to complete purchase',
        code: 'PURCHASE_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/wallet/rewards
 * Get available and historical rewards
 */
export async function GET_REWARDS(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wallet address is required',
        code: 'MISSING_ADDRESS'
      },
      { status: 400 }
    );
  }

  // In production for Haulout Hackathon:
  // 1. Query AI training contribution contracts
  // 2. Query data validation contracts
  // 3. Query marketplace seller rewards
  // 4. Calculate unclaimed rewards
  // 5. Return reward breakdown by category
  
  const rewards = [
    {
      id: 'reward-1',
      type: 'ai_training',
      amount: 25.5,
      token: 'SUI',
      description: 'Federated Learning Contribution',
      status: 'claimable',
      earnedAt: new Date(Date.now() - 86400000).toISOString(),
      metadata: {
        modelId: 'model-xyz-123',
        epochsContributed: 15,
        dataPointsProcessed: 50000
      }
    },
    {
      id: 'reward-2',
      type: 'data_validation',
      amount: 150,
      token: 'DATA',
      description: 'Dataset Quality Validation',
      status: 'claimable',
      earnedAt: new Date(Date.now() - 172800000).toISOString(),
      metadata: {
        datasetsValidated: 5,
        accuracyScore: 98.5
      }
    },
    {
      id: 'reward-3',
      type: 'marketplace_seller',
      amount: 50.0,
      token: 'SUI',
      description: 'Dataset Sales Commission',
      status: 'claimed',
      earnedAt: new Date(Date.now() - 604800000).toISOString(),
      claimedAt: new Date(Date.now() - 259200000).toISOString(),
      metadata: {
        datasetsSold: 3,
        totalRevenue: 150.0,
        commissionRate: 0.33
      }
    }
  ];

  const claimable = rewards.filter(r => r.status === 'claimable');
  const totalClaimableSUI = claimable
    .filter(r => r.token === 'SUI')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalClaimableDATA = claimable
    .filter(r => r.token === 'DATA')
    .reduce((sum, r) => sum + r.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      rewards,
      summary: {
        totalClaimableSUI,
        totalClaimableDATA,
        claimableCount: claimable.length,
        totalRewardsCount: rewards.length
      }
    }
  });
}

/**
 * POST /api/wallet/stake
 * Stake SUI tokens for network security
 */
export async function STAKE(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, amount } = body;

    if (!address || !amount || amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid staking parameters',
          code: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    // In production:
    // 1. Call Sui staking contract
    // 2. Lock tokens for staking period
    // 3. Calculate expected APY
    // 4. Return staking confirmation

    await new Promise(resolve => setTimeout(resolve, 1500));

    const stakingInfo = {
      stakedAmount: amount,
      validator: '0xvalidator-node-123',
      apy: 8.5,
      lockPeriod: '30 days',
      expectedRewards: amount * 0.085 * (30 / 365),
      unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        stakingInfo,
        message: 'Successfully staked SUI tokens',
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      }
    });

  } catch (error) {
    console.error('Staking error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to stake tokens',
        code: 'STAKE_ERROR'
      },
      { status: 500 }
    );
  }
}