'use client';

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[SuiClient]', ...args);
  }
};

// Custom error class for Sui client errors
export class SuiClientError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'SuiClientError';
  }
}

// Environment variable validation
const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || process.env.SUI_RPC_URL;

// Validate configuration
if (!SUI_RPC_URL) {
  // Fallback to default testnet URL if no environment variable is set
  debugLog('No SUI_RPC_URL found in environment, using default testnet URL');
}

// SuiClientManager class
class SuiClientManager {
  private client: SuiClient | null = null;
  private network: string;

  constructor() {
    // Determine the network URL
    let rpcUrl: string;
    
    if (SUI_RPC_URL) {
      rpcUrl = SUI_RPC_URL;
      this.network = 'custom';
    } else {
      // Default to testnet if no URL is provided
      rpcUrl = getFullnodeUrl('testnet');
      this.network = 'testnet';
    }
    
    debugLog(`Initializing SuiClient for network: ${this.network} (${rpcUrl})`);
    
    // Create the SuiClient instance
    try {
      this.client = new SuiClient({
        url: rpcUrl,
      });
    } catch (error) {
      throw new SuiClientError(
        `Failed to initialize SuiClient: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get the SuiClient instance
   * @returns SuiClient instance
   */
  getClient(): SuiClient {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    return this.client;
  }

  /**
   * Get the current network name
   * @returns Network name
   */
  getNetwork(): string {
    return this.network;
  }

  /**
   * Fetch an object by its ID
   * @param objectId Object ID
   * @returns Promise resolving to the object data
   */
  async getObject(objectId: string) {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    
    if (!objectId || typeof objectId !== 'string') {
      throw new SuiClientError('Invalid object ID provided');
    }
    
    try {
      debugLog(`Fetching object: ${objectId}`);
      const object = await this.client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });
      
      if (object.error) {
        throw new SuiClientError(`Failed to fetch object: ${object.error}`);
      }
      
      return object;
    } catch (error) {
      throw new SuiClientError(
        `Failed to fetch object ${objectId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Fetch multiple objects by their IDs
   * @param objectIds Array of object IDs
   * @returns Promise resolving to the objects data
   */
  async getObjects(objectIds: string[]) {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    
    if (!Array.isArray(objectIds) || objectIds.length === 0) {
      throw new SuiClientError('Invalid object IDs provided');
    }
    
    try {
      debugLog(`Fetching ${objectIds.length} objects`);
      const objects = await this.client.multiGetObjects({
        ids: objectIds,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });
      
      return objects;
    } catch (error) {
      throw new SuiClientError(
        `Failed to fetch objects: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get field value from an object
   * @param objectId Object ID
   * @param fieldName Field name
   * @returns Promise resolving to the field value
   */
  async getObjectField(objectId: string, fieldName: string): Promise<any> {
    try {
      const object = await this.getObject(objectId);
      
      if (!object.data?.content) {
        throw new SuiClientError('Object has no content');
      }
      
      if (object.data.content.dataType !== 'moveObject') {
        throw new SuiClientError('Object is not a Move object');
      }
      
      const fields = object.data.content.fields as Record<string, any>;
      
      if (!(fieldName in fields)) {
        throw new SuiClientError(`Field '${fieldName}' not found in object`);
      }
      
      return fields[fieldName];
    } catch (error) {
      throw new SuiClientError(
        `Failed to get field '${fieldName}' from object ${objectId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get the chain identifier
   * @returns Promise resolving to the chain identifier
   */
  async getChainId(): Promise<string> {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    
    try {
      debugLog('Fetching chain identifier');
      const chainId = await this.client.getChainIdentifier();
      return chainId;
    } catch (error) {
      throw new SuiClientError(
        `Failed to fetch chain identifier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get the latest checkpoint sequence number
   * @returns Promise resolving to the latest checkpoint sequence number
   */
  async getLatestCheckpoint(): Promise<string> {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    
    try {
      debugLog('Fetching latest checkpoint');
      const checkpoint = await this.client.getLatestCheckpointSequenceNumber();
      return checkpoint;
    } catch (error) {
      throw new SuiClientError(
        `Failed to fetch latest checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Execute a read-only move call
   * @param target Move function target (e.g., "0x123::module::function")
   * @param arguments_ Function arguments
   * @param typeArguments Type arguments
   * @returns Promise resolving to the call result
   */
  async executeMoveCall(
    target: string,
    arguments_: any[] = [],
    typeArguments: string[] = []
  ) {
    if (!this.client) {
      throw new SuiClientError('SuiClient is not initialized');
    }
    
    if (!target || typeof target !== 'string') {
      throw new SuiClientError('Invalid target provided');
    }
    
    try {
      debugLog(`Executing move call: ${target}`);
      
      // Create a transaction block
      const tx = new Transaction();
      
      // Add the move call to the transaction
      tx.moveCall({
        target,
        arguments: arguments_,
        typeArguments,
      });
      
      // Serialize the transaction
      const serializedTx = await tx.build({ client: this.client });
      
      // Execute dry run
      const result = await this.client.dryRunTransactionBlock({
        transactionBlock: serializedTx,
      });
      
      return result;
    } catch (error) {
      throw new SuiClientError(
        `Failed to execute move call ${target}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }
}

// Export singleton instance
export const suiClientManager = new SuiClientManager();

// Export types
export type { SuiClient };