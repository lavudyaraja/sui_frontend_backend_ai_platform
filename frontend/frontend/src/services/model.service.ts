import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[ModelService]', ...args);
  }
};

// Environment variables with fallbacks
const MODEL_PACKAGE_ID = process.env.NEXT_PUBLIC_MODEL_PACKAGE_ID || process.env.MODEL_PACKAGE_ID;
const MODEL_OBJECT_ID = process.env.NEXT_PUBLIC_MODEL_OBJECT_ID || process.env.MODEL_OBJECT_ID;
const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet';

// Custom error class
export class ModelServiceError extends Error {
  constructor(message: string, public code?: string, public originalError?: any) {
    super(message);
    this.name = 'ModelServiceError';
  }
}

// Type definitions
export interface ModelInfo {
  name: string;
  description: string;
  version: number;
  latestWeightsCid: string;
  owner: string;
  totalContributions?: number;
  lastUpdated?: number;
}

export interface GradientRef {
  contributor: string;
  cid: string;
  timestamp: number;
  validated: boolean;
  metadata?: Record<string, any>;
  validationScore?: number;
}

export type SignerLike = {
  getAddress: () => Promise<string>;
  signAndExecuteTransaction: (transaction: Transaction) => Promise<{
    digest: string;
    effects?: any;
  }>;
} | any;

// Model service class
export class ModelService {
  private suiClient: SuiClient;
  private modelPackageId: string;
  private modelObjectId: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 30000; // 30 seconds

  constructor() {
    // Initialize Sui client based on environment
    const networkUrl = SUI_NETWORK === 'mainnet' 
      ? getFullnodeUrl('mainnet')
      : SUI_NETWORK === 'devnet'
      ? getFullnodeUrl('devnet')
      : getFullnodeUrl('testnet');

    this.suiClient = new SuiClient({ url: networkUrl });
    this.modelPackageId = MODEL_PACKAGE_ID || '';
    this.modelObjectId = MODEL_OBJECT_ID || '';
    this.cache = new Map();
    
    debugLog('ModelService initialized', {
      network: SUI_NETWORK,
      packageId: this.modelPackageId ? '✓' : '✗',
      objectId: this.modelObjectId ? '✓' : '✗',
    });
  }

  /**
   * Get cached data or fetch new
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      debugLog('Cache hit:', key);
      return cached.data as T;
    }
    return null;
  }

  /**
   * Set cache data
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get the latest model information
   */
  async getLatestModel(): Promise<ModelInfo> {
    debugLog('Fetching latest model information');
    
    // Check cache first
    const cached = this.getFromCache<ModelInfo>('latest-model');
    if (cached) return cached;

    try {
      if (!this.modelObjectId) {
        throw new ModelServiceError(
          'Model object ID not configured',
          'CONFIG_ERROR'
        );
      }

      const object = await this.suiClient.getObject({
        id: this.modelObjectId,
        options: {
          showContent: true,
          showOwner: true,
        },
      });

      if (!object.data) {
        throw new ModelServiceError(
          'Model object not found',
          'NOT_FOUND'
        );
      }

      if (object.data.content?.dataType !== 'moveObject') {
        throw new ModelServiceError(
          'Invalid model object type',
          'INVALID_TYPE'
        );
      }

      const fields = object.data.content.fields as any;
      
      // Extract owner address
      let owner = '';
      if (object.data.owner) {
        if (typeof object.data.owner === 'object' && 'AddressOwner' in object.data.owner) {
          owner = (object.data.owner as { AddressOwner: string }).AddressOwner;
        } else if (typeof object.data.owner === 'string') {
          owner = object.data.owner;
        }
      }

      const modelInfo: ModelInfo = {
        name: fields.name || 'Unnamed Model',
        description: fields.description || '',
        version: Number(fields.version) || 0,
        latestWeightsCid: fields.latest_weights_cid || fields.latestWeightsCid || '',
        owner,
        totalContributions: Number(fields.total_contributions) || 0,
        lastUpdated: Number(fields.last_updated) || Date.now(),
      };

      // Cache the result
      this.setCache('latest-model', modelInfo);
      
      debugLog('Model fetched successfully:', modelInfo);
      return modelInfo;
    } catch (error) {
      debugLog('Error fetching model:', error);
      throw new ModelServiceError(
        `Failed to fetch latest model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FETCH_ERROR',
        error
      );
    }
  }

  /**
   * Create a new model
   */
  async createModel(
    name: string,
    description: string,
    initialWeightsCid: string,
    signer: SignerLike
  ): Promise<string> {
    debugLog('Creating new model:', { name, description, initialWeightsCid });
    
    try {
      if (!this.modelPackageId) {
        throw new ModelServiceError(
          'Model package ID not configured',
          'CONFIG_ERROR'
        );
      }

      const tx = new Transaction();
      
      tx.moveCall({
        target: `${this.modelPackageId}::model::create`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(initialWeightsCid),
        ],
      });

      const result = await signer.signAndExecuteTransaction(tx);
      
      // Clear cache
      this.cache.clear();
      
      debugLog('Model created successfully:', result.digest);
      return result.digest;
    } catch (error) {
      debugLog('Error creating model:', error);
      throw new ModelServiceError(
        `Failed to create model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CREATE_ERROR',
        error
      );
    }
  }

  /**
   * Submit a gradient CID to the model
   */
  async submitGradientCid(
    modelId: string,
    cid: string,
    metadata: Record<string, any> = {},
    signer: SignerLike
  ): Promise<string> {
    debugLog('Submitting gradient CID:', { modelId, cid, metadata });
    
    try {
      if (!this.modelPackageId) {
        throw new ModelServiceError(
          'Model package ID not configured',
          'CONFIG_ERROR'
        );
      }

      const tx = new Transaction();
      const metadataString = JSON.stringify(metadata);
      
      tx.moveCall({
        target: `${this.modelPackageId}::model::submit_gradient`,
        arguments: [
          tx.object(modelId),
          tx.pure.string(cid),
          tx.pure.string(metadataString),
        ],
      });

      const result = await signer.signAndExecuteTransaction(tx);
      
      // Clear cache
      this.cache.delete('latest-model');
      this.cache.delete(`pending-gradients-${modelId}`);
      
      debugLog('Gradient submitted successfully:', result.digest);
      return result.digest;
    } catch (error) {
      debugLog('Error submitting gradient:', error);
      throw new ModelServiceError(
        `Failed to submit gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUBMIT_ERROR',
        error
      );
    }
  }

  /**
   * Validate a gradient
   */
  async validateGradient(
    modelId: string,
    idx: number,
    points: number,
    signer: SignerLike
  ): Promise<string> {
    debugLog('Validating gradient:', { modelId, idx, points });
    
    try {
      if (!this.modelPackageId) {
        throw new ModelServiceError(
          'Model package ID not configured',
          'CONFIG_ERROR'
        );
      }

      const tx = new Transaction();
      
      tx.moveCall({
        target: `${this.modelPackageId}::model::validate_gradient`,
        arguments: [
          tx.object(modelId),
          tx.pure.u64(idx),
          tx.pure.u64(points),
        ],
      });

      const result = await signer.signAndExecuteTransaction(tx);
      
      // Clear cache
      this.cache.delete(`pending-gradients-${modelId}`);
      
      debugLog('Gradient validated successfully:', result.digest);
      return result.digest;
    } catch (error) {
      debugLog('Error validating gradient:', error);
      throw new ModelServiceError(
        `Failed to validate gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VALIDATE_ERROR',
        error
      );
    }
  }

  /**
   * Finalize gradient aggregation
   */
  async finalizeAggregation(
    modelId: string,
    newWeightsCid: string,
    signer: SignerLike
  ): Promise<string> {
    debugLog('Finalizing aggregation:', { modelId, newWeightsCid });
    
    try {
      if (!this.modelPackageId) {
        throw new ModelServiceError(
          'Model package ID not configured',
          'CONFIG_ERROR'
        );
      }

      const tx = new Transaction();
      
      tx.moveCall({
        target: `${this.modelPackageId}::model::finalize_aggregation`,
        arguments: [
          tx.object(modelId),
          tx.pure.string(newWeightsCid),
        ],
      });

      const result = await signer.signAndExecuteTransaction(tx);
      
      // Clear all caches
      this.cache.clear();
      
      debugLog('Aggregation finalized successfully:', result.digest);
      return result.digest;
    } catch (error) {
      debugLog('Error finalizing aggregation:', error);
      throw new ModelServiceError(
        `Failed to finalize aggregation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FINALIZE_ERROR',
        error
      );
    }
  }

  /**
   * Fetch pending gradients for a model
   */
  async fetchPendingGradients(modelId: string): Promise<GradientRef[]> {
    debugLog('Fetching pending gradients for model:', modelId);
    
    // Check cache
    const cacheKey = `pending-gradients-${modelId}`;
    const cached = this.getFromCache<GradientRef[]>(cacheKey);
    if (cached) return cached;

    try {
      const object = await this.suiClient.getObject({
        id: modelId,
        options: {
          showContent: true,
        },
      });

      if (!object.data?.content || object.data.content.dataType !== 'moveObject') {
        return [];
      }

      const fields = object.data.content.fields as any;
      
      // Extract gradients
      const gradients: GradientRef[] = [];
      if (fields.gradients && Array.isArray(fields.gradients)) {
        gradients.push(...fields.gradients.map((grad: any) => ({
          contributor: grad.contributor || '',
          cid: grad.cid || '',
          timestamp: Number(grad.timestamp) || Date.now(),
          validated: Boolean(grad.validated),
          metadata: grad.metadata ? JSON.parse(grad.metadata) : undefined,
          validationScore: grad.validation_score ? Number(grad.validation_score) : undefined,
        })));
      }

      // Cache the result
      this.setCache(cacheKey, gradients);
      
      debugLog(`Found ${gradients.length} pending gradients`);
      return gradients;
    } catch (error) {
      debugLog('Error fetching pending gradients:', error);
      throw new ModelServiceError(
        `Failed to fetch pending gradients: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FETCH_GRADIENTS_ERROR',
        error
      );
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    debugLog('Cache cleared');
  }
}

// Export singleton instance
export const modelService = new ModelService();