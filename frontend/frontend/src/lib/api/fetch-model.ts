'use client';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[ModelFetch]', ...args);
  }
};

// Custom error class
export class ModelFetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ModelFetchError';
  }
}

// ModelInfo type definition
export interface ModelInfo {
  version: number;
  weightsCid: string;
  name: string;
  description: string;
  owner: string;
  updatedAt: number;
  contributorCount: number;
  gradientCount: number;
  pendingGradients?: Array<{
    contributor: string;
    cid: string;
    timestamp: number;
    validated: boolean;
    metadata?: any;
  }>;
}

/**
 * Helper function to fetch JSON with timeout and retry logic
 */
async function getJSON<T>(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  debugLog(`Fetching JSON from: ${url}`);
  
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ModelFetchError(
          `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
          response.status
        );
      }
      
      const data = await response.json();
      
      // Validate response
      if (!data.success) {
        throw new ModelFetchError(
          data.error || 'API returned unsuccessful response',
          response.status
        );
      }
      
      return data.data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Don't retry on certain errors
      if (error.name === 'AbortError') {
        if (attempt < retries - 1) {
          debugLog(`Request timeout, retrying... (${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        throw new ModelFetchError('Request timeout after multiple attempts');
      }
      
      if (error instanceof ModelFetchError && error.statusCode === 404) {
        throw error; // Don't retry 404s
      }
      
      if (attempt < retries - 1) {
        debugLog(`Fetch failed, retrying... (${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      if (error instanceof ModelFetchError) {
        throw error;
      }
      
      throw new ModelFetchError(
        `Failed to fetch JSON: ${error.message}`,
        undefined,
        error
      );
    }
  }
  
  throw new ModelFetchError('Max retries exceeded');
}

/**
 * Fetch the latest model information
 */
export async function fetchLatestModel(): Promise<ModelInfo> {
  debugLog('Fetching latest model information');
  
  try {
    const data = await getJSON<ModelInfo>('/api/model');
    
    // Validate response structure
    if (!data || typeof data.version !== 'number' || !data.weightsCid) {
      throw new ModelFetchError('Invalid model data structure received from API');
    }
    
    debugLog('Latest model fetched successfully:', data);
    return data;
  } catch (error) {
    debugLog('Failed to fetch latest model:', error);
    
    if (error instanceof ModelFetchError) {
      throw error;
    }
    
    throw new ModelFetchError(
      `Failed to fetch latest model: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Fetch model information by version
 */
export async function fetchModelByVersion(version: number): Promise<ModelInfo> {
  debugLog(`Fetching model information for version: ${version}`);
  
  if (typeof version !== 'number' || version < 0) {
    throw new ModelFetchError('Invalid version number provided');
  }
  
  try {
    const data = await getJSON<ModelInfo>(
      `/api/model?version=${encodeURIComponent(version)}`
    );
    
    if (!data || typeof data.version !== 'number' || !data.weightsCid) {
      throw new ModelFetchError('Invalid model data structure received from API');
    }
    
    return data;
  } catch (error) {
    debugLog(`Failed to fetch model version ${version}:`, error);
    
    if (error instanceof ModelFetchError) {
      throw error;
    }
    
    throw new ModelFetchError(
      `Failed to fetch model version ${version}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Submit a gradient to the model
 */
export async function submitGradient(
  modelId: string,
  gradientCid: string,
  metadata: Record<string, any> = {},
  signerData: any
): Promise<{ transactionDigest: string }> {
  debugLog('Submitting gradient:', { modelId, gradientCid });
  
  try {
    const response = await fetch('/api/model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit_gradient',
        modelId,
        gradientCid,
        metadata,
        signerData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ModelFetchError(
        errorData.error || 'Failed to submit gradient',
        response.status
      );
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new ModelFetchError(result.error || 'Gradient submission failed');
    }

    return result.data;
  } catch (error) {
    debugLog('Failed to submit gradient:', error);
    
    if (error instanceof ModelFetchError) {
      throw error;
    }
    
    throw new ModelFetchError(
      `Failed to submit gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Validate a gradient
 */
export async function validateGradient(
  modelId: string,
  gradientIdx: number,
  validationPoints: number,
  signerData: any
): Promise<{ transactionDigest: string }> {
  debugLog('Validating gradient:', { modelId, gradientIdx, validationPoints });
  
  try {
    const response = await fetch('/api/model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'validate_gradient',
        modelId,
        gradientIdx,
        validationPoints,
        signerData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ModelFetchError(
        errorData.error || 'Failed to validate gradient',
        response.status
      );
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new ModelFetchError(result.error || 'Gradient validation failed');
    }

    return result.data;
  } catch (error) {
    debugLog('Failed to validate gradient:', error);
    
    if (error instanceof ModelFetchError) {
      throw error;
    }
    
    throw new ModelFetchError(
      `Failed to validate gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Real-time model updates using polling
 */
export class ModelUpdateStream {
  private intervalId: number | null = null;
  private listeners: Set<(model: ModelInfo) => void> = new Set();
  private lastVersion: number = -1;

  constructor(private pollInterval: number = 5000) {}

  /**
   * Start listening for model updates
   */
  start(): void {
    if (this.intervalId !== null) return;
    
    debugLog('Starting model update stream');
    
    // Initial fetch
    this.poll();
    
    // Set up polling
    this.intervalId = window.setInterval(() => {
      this.poll();
    }, this.pollInterval);
  }

  /**
   * Stop listening for updates
   */
  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      debugLog('Stopped model update stream');
    }
  }

  /**
   * Add update listener
   */
  onUpdate(callback: (model: ModelInfo) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Poll for updates
   */
  private async poll(): Promise<void> {
    try {
      const model = await fetchLatestModel();
      
      // Only notify if version changed
      if (model.version !== this.lastVersion) {
        this.lastVersion = model.version;
        this.listeners.forEach(callback => callback(model));
      }
    } catch (error) {
      debugLog('Poll error:', error);
    }
  }

  /**
   * Get current listener count
   */
  get listenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * Create a model update stream
 */
export function createModelUpdateStream(pollInterval?: number): ModelUpdateStream {
  return new ModelUpdateStream(pollInterval);
}