/**
 * Transaction builder layer for the Sui-DAT protocol
 * Provides clean, reusable utilities for constructing Move call payloads
 */

'use client';

import { Transaction } from '@mysten/sui/transactions';

// Environment-based contract configuration
const CONTRACT_CONFIG = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_SUI_DAT_PACKAGE_ID || '',
  MODEL_MODULE: 'model',
  CONTRIBUTOR_MODULE: 'contributor',
  GLOBAL_CONFIG_ID: process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID || '',
  MODEL_REGISTRY_ID: process.env.NEXT_PUBLIC_MODEL_REGISTRY_ID || '',
};

// Custom error class for transaction building errors
export class TransactionBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionBuilderError';
  }
}

// Utility to validate required environment variables
function validateContractConfig(): void {
  if (!CONTRACT_CONFIG.PACKAGE_ID) {
    throw new TransactionBuilderError('NEXT_PUBLIC_SUI_DAT_PACKAGE_ID is not set in environment variables');
  }
  if (!CONTRACT_CONFIG.GLOBAL_CONFIG_ID) {
    throw new TransactionBuilderError('NEXT_PUBLIC_GLOBAL_CONFIG_ID is not set in environment variables');
  }
  if (!CONTRACT_CONFIG.MODEL_REGISTRY_ID) {
    throw new TransactionBuilderError('NEXT_PUBLIC_MODEL_REGISTRY_ID is not set in environment variables');
  }
}

// Debug logging utility (only in development)
const debugLog = (...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[TransactionBuilder]', ...args);
  }
};

// Initialize configuration validation
validateContractConfig();

/**
 * Model transaction builders
 */
export class ModelTransactions {
  /**
   * Build a transaction to create a new model
   * @param initialWeightsCid CID of the initial model weights
   * @returns Transaction object ready to be signed and executed
   */
  static createModel(initialWeightsCid: string): Transaction {
    debugLog('Building createModel transaction with weights CID:', initialWeightsCid);
    
    if (!initialWeightsCid || typeof initialWeightsCid !== 'string') {
      throw new TransactionBuilderError('Invalid initial weights CID provided');
    }

    const tx = new Transaction();
    
    const registry = tx.object(CONTRACT_CONFIG.MODEL_REGISTRY_ID);
    const config = tx.object(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODEL_MODULE}::create_model`,
      arguments: [
        registry,
        config,
        tx.pure.string(initialWeightsCid),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to submit a gradient contribution
   * @param modelVersion Version of the model being updated
   * @param gradientCid CID of the gradient data
   * @returns Transaction object ready to be signed and executed
   */
  static submitGradient(modelVersion: number, gradientCid: string): Transaction {
    debugLog('Building submitGradient transaction for model version:', modelVersion);
    
    if (!gradientCid || typeof gradientCid !== 'string') {
      throw new TransactionBuilderError('Invalid gradient CID provided');
    }

    if (modelVersion <= 0) {
      throw new TransactionBuilderError('Invalid model version provided');
    }

    const tx = new Transaction();
    
    const registry = tx.object(CONTRACT_CONFIG.MODEL_REGISTRY_ID);
    const config = tx.object(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODEL_MODULE}::submit_gradient`,
      arguments: [
        registry,
        config,
        tx.pure.u64(modelVersion),
        tx.pure.string(gradientCid),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to finalize gradient aggregation
   * @param modelVersion Version of the model being finalized
   * @param newWeightsCid CID of the new aggregated weights
   * @returns Transaction object ready to be signed and executed
   */
  static finalizeAggregation(modelVersion: number, newWeightsCid: string): Transaction {
    debugLog('Building finalizeAggregation transaction for model version:', modelVersion);
    
    if (!newWeightsCid || typeof newWeightsCid !== 'string') {
      throw new TransactionBuilderError('Invalid new weights CID provided');
    }

    if (modelVersion <= 0) {
      throw new TransactionBuilderError('Invalid model version provided');
    }

    const tx = new Transaction();
    
    const registry = tx.object(CONTRACT_CONFIG.MODEL_REGISTRY_ID);
    const config = tx.object(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODEL_MODULE}::finalize_aggregation`,
      arguments: [
        registry,
        config,
        tx.pure.u64(modelVersion),
        tx.pure.string(newWeightsCid),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to get a model by version (view function)
   * @param modelVersion Version of the model to retrieve
   * @returns Transaction object for dry run execution
   */
  static getModelByVersion(modelVersion: number): Transaction {
    debugLog('Building getModelByVersion transaction for version:', modelVersion);
    
    if (modelVersion <= 0) {
      throw new TransactionBuilderError('Invalid model version provided');
    }

    const tx = new Transaction();
    
    const registry = tx.object(CONTRACT_CONFIG.MODEL_REGISTRY_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODEL_MODULE}::get_model_by_version`,
      arguments: [
        registry,
        tx.pure.u64(modelVersion),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to get the latest model (view function)
   * @returns Transaction object for dry run execution
   */
  static getLatestModel(): Transaction {
    debugLog('Building getLatestModel transaction');
    
    const tx = new Transaction();
    
    const registry = tx.object(CONTRACT_CONFIG.MODEL_REGISTRY_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODEL_MODULE}::get_latest_model`,
      arguments: [registry],
    });

    return tx;
  }
}

/**
 * Contributor transaction builders
 */
export class ContributorTransactions {
  /**
   * Build a transaction to get contributor information (view function)
   * @param contributorAddress Address of the contributor
   * @returns Transaction object for dry run execution
   */
  static getContributor(contributorAddress: string): Transaction {
    debugLog('Building getContributor transaction for address:', contributorAddress);
    
    if (!contributorAddress) {
      throw new TransactionBuilderError('Contributor address is required');
    }

    const tx = new Transaction();
    
    const config = tx.object(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CONTRIBUTOR_MODULE}::get_contributor`,
      arguments: [
        config,
        tx.pure.address(contributorAddress),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to award reputation to a contributor
   * @param contributorAddress Address of the contributor to award
   * @param amount Amount of reputation to award
   * @returns Transaction object ready to be signed and executed
   */
  static awardReputation(contributorAddress: string, amount: number): Transaction {
    debugLog('Building awardReputation transaction for address:', contributorAddress);
    
    if (!contributorAddress) {
      throw new TransactionBuilderError('Contributor address is required');
    }

    if (amount <= 0) {
      throw new TransactionBuilderError('Reputation amount must be positive');
    }

    const tx = new Transaction();
    
    const config = tx.object(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CONTRIBUTOR_MODULE}::award_reputation`,
      arguments: [
        config,
        tx.pure.address(contributorAddress),
        tx.pure.u64(amount),
      ],
    });

    return tx;
  }
}

/**
 * Generic transaction utilities
 */
export class TransactionUtils {
  /**
   * Add standard gas settings to a transaction
   * @param tx Transaction to configure
   * @param budget Gas budget in SUI units
   * @param price Gas price in MIST units
   */
  static setGasSettings(tx: Transaction, budget?: number, price?: number): void {
    if (budget !== undefined) {
      tx.setGasBudget(BigInt(budget));
    }
    if (price !== undefined) {
      tx.setGasPrice(BigInt(price));
    }
  }
}

// Export transaction builder instances for convenient access
export const modelTx = ModelTransactions;
export const contributorTx = ContributorTransactions;
export const txUtils = TransactionUtils;