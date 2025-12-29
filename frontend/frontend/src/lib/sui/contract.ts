/**
 * High-level Move contract interaction layer for the Sui-DAT protocol
 * Provides clean abstractions for calling Sui Move functions and managing on-chain state
 */

'use client';

import { Transaction, TransactionResult } from '@mysten/sui/transactions';
import { SuiObjectRef, SuiObjectData } from '@mysten/sui/client';
import { useWallet, walletManager } from './wallet';
import { suiClientManager } from './client';

// Environment-based contract configuration
const CONTRACT_CONFIG = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_SUI_DAT_PACKAGE_ID || '',
  MODEL_MODULE: 'model',
  CONTRIBUTOR_MODULE: 'contributor',
  GLOBAL_CONFIG_ID: process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID || '',
  MODEL_REGISTRY_ID: process.env.NEXT_PUBLIC_MODEL_REGISTRY_ID || '',
};

// Custom error classes for contract interactions
export class ContractError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export class ValidationError extends ContractError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class TransactionError extends ContractError {
  constructor(message: string) {
    super(message, 'TRANSACTION_ERROR');
    this.name = 'TransactionError';
  }
}

// Type definitions for contract interactions
export interface ModelInfo {
  id: string;
  version: number;
  weightsCid: string;
  owner: string;
  createdAt: number;
}

export interface GradientSubmission {
  contributor: string;
  modelVersion: number;
  gradientCid: string;
  timestamp: number;
}

export interface ContributorInfo {
  address: string;
  reputation: number;
  contributions: number;
  lastContribution: number;
}

export interface GlobalConfig {
  admin: string;
  minStake: string;
  rewardPerContribution: string;
}

// Utility to validate required environment variables
function validateContractConfig(): void {
  if (!CONTRACT_CONFIG.PACKAGE_ID) {
    throw new ValidationError('NEXT_PUBLIC_SUI_DAT_PACKAGE_ID is not set in environment variables');
  }
  if (!CONTRACT_CONFIG.GLOBAL_CONFIG_ID) {
    throw new ValidationError('NEXT_PUBLIC_GLOBAL_CONFIG_ID is not set in environment variables');
  }
  if (!CONTRACT_CONFIG.MODEL_REGISTRY_ID) {
    throw new ValidationError('NEXT_PUBLIC_MODEL_REGISTRY_ID is not set in environment variables');
  }
}

// Debug logging utility (only in development)
const debugLog = (...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Contract]', ...args);
  }
};

/**
 * Main contract interaction class
 * Provides high-level abstractions for all Sui-DAT Move functions
 */
export class SuiDatContract {
  constructor() {
    validateContractConfig();
  }

  /**
   * Get the global configuration object
   */
  async getGlobalConfig(): Promise<GlobalConfig> {
    try {
      debugLog('Fetching global config:', CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
      
      const obj = await suiClientManager.getObject(CONTRACT_CONFIG.GLOBAL_CONFIG_ID);
      if (!obj) {
        throw new ContractError('Global config object not found');
      }

      // Accessing fields correctly based on the Sui object structure
      const content = (obj as any).data?.content;
      if (!content || content.dataType !== 'moveObject') {
        throw new ContractError('Global config object has invalid content structure');
      }

      const fields = content.fields;
      if (!fields) {
        throw new ContractError('Global config object has no fields');
      }

      return {
        admin: fields.admin || '',
        minStake: fields.min_stake || '0',
        rewardPerContribution: fields.reward_per_contribution || '0',
      };
    } catch (error: any) {
      throw new ContractError(`Failed to fetch global config: ${error.message}`);
    }
  }

  /**
   * Get model information by version
   */
  async getModelByVersion(version: number): Promise<ModelInfo | null> {
    try {
      debugLog('Fetching model by version:', version);
      
      // In a real implementation, this would call the appropriate Move function
      // For now, we'll return null to indicate the method needs to be implemented
      return null;
    } catch (error: any) {
      throw new ContractError(`Failed to fetch model by version: ${error.message}`);
    }
  }

  /**
   * Get the latest model
   */
  async getLatestModel(): Promise<ModelInfo | null> {
    try {
      debugLog('Fetching latest model');
      
      // In a real implementation, this would call the appropriate Move function
      // For now, we'll return null to indicate the method needs to be implemented
      return null;
    } catch (error: any) {
      throw new ContractError(`Failed to fetch latest model: ${error.message}`);
    }
  }

  /**
   * Submit a gradient contribution to the chain
   */
  async submitGradient(
    modelVersion: number,
    gradientCid: string
  ): Promise<string> {
    try {
      debugLog('Submitting gradient for model version:', modelVersion);
      
      // Validate inputs
      if (!gradientCid || typeof gradientCid !== 'string') {
        throw new ValidationError('Invalid gradient CID provided');
      }

      if (modelVersion <= 0) {
        throw new ValidationError('Invalid model version provided');
      }

      // This is a placeholder implementation
      // In a real implementation, this would create and execute a transaction
      throw new Error('Not implemented');
    } catch (error: any) {
      if (error instanceof ContractError) {
        throw error;
      }
      throw new TransactionError(`Failed to submit gradient: ${error.message}`);
    }
  }

  /**
   * Create a new model
   */
  async createModel(
    initialWeightsCid: string
  ): Promise<string> {
    try {
      debugLog('Creating new model with weights CID:', initialWeightsCid);
      
      // Validate inputs
      if (!initialWeightsCid || typeof initialWeightsCid !== 'string') {
        throw new ValidationError('Invalid initial weights CID provided');
      }

      // This is a placeholder implementation
      // In a real implementation, this would create and execute a transaction
      throw new Error('Not implemented');
    } catch (error: any) {
      if (error instanceof ContractError) {
        throw error;
      }
      throw new TransactionError(`Failed to create model: ${error.message}`);
    }
  }

  /**
   * Get contributor information
   */
  async getContributor(address: string): Promise<ContributorInfo | null> {
    try {
      debugLog('Fetching contributor info for:', address);
      
      if (!address) {
        throw new ValidationError('Address is required');
      }

      // In a real implementation, this would call the appropriate Move function
      // For now, returning mock data
      return {
        address,
        reputation: 100,
        contributions: 5,
        lastContribution: Date.now(),
      };
    } catch (error: any) {
      throw new ContractError(`Failed to fetch contributor info: ${error.message}`);
    }
  }

  /**
   * Get pending gradients for aggregation
   */
  async getPendingGradients(modelVersion: number): Promise<GradientSubmission[]> {
    try {
      debugLog('Fetching pending gradients for model version:', modelVersion);
      
      // In a real implementation, this would call a Move function
      // to retrieve pending gradients for aggregation
      return [];
    } catch (error: any) {
      throw new ContractError(`Failed to fetch pending gradients: ${error.message}`);
    }
  }

  /**
   * Finalize gradient aggregation
   */
  async finalizeAggregation(
    modelVersion: number,
    newWeightsCid: string
  ): Promise<string> {
    try {
      debugLog('Finalizing aggregation for model version:', modelVersion);
      
      // Validate inputs
      if (!newWeightsCid || typeof newWeightsCid !== 'string') {
        throw new ValidationError('Invalid new weights CID provided');
      }

      if (modelVersion <= 0) {
        throw new ValidationError('Invalid model version provided');
      }

      // This is a placeholder implementation
      // In a real implementation, this would create and execute a transaction
      throw new Error('Not implemented');
    } catch (error: any) {
      if (error instanceof ContractError) {
        throw error;
      }
      throw new TransactionError(`Failed to finalize aggregation: ${error.message}`);
    }
  }
}

/**
 * React hook for accessing contract functionality
 * Provides an easy way to interact with the Sui-DAT contract in components
 */
export function useSuiDatContract(): SuiDatContract {
  // In a real implementation, you might want to use React context
  // to share a single instance across components
  return new SuiDatContract();
}

// Export singleton instance for direct usage
export const suiDatContract = new SuiDatContract();