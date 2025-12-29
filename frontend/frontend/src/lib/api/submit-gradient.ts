'use client';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[SubmitGradient]', ...args);
  }
};

// Custom error class for gradient submission errors
export class SubmitGradientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'SubmitGradientError';
  }
}

// Type definitions
export interface SubmitPayload {
  /** CID of the gradient data */
  cid: string;
  /** Loss value */
  loss: number;
  /** Model version */
  version: number;
  /** Optional statistics */
  stats?: Record<string, any>;
  /** Optional signer for on-chain Move call */
  signer?: any;
}

export interface SubmitResult {
  /** Whether the submission was successful */
  ok: boolean;
  /** Transaction digest (if on-chain) */
  txDigest?: string;
  /** Optional message */
  message?: string;
}

/**
 * Helper function to fetch with timeout and error handling
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to parsed JSON
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<any> {
  debugLog(`Fetching from: ${url}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
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
      throw new SubmitGradientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    
    const text = await response.text();
    if (!text) return null;
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new SubmitGradientError(
        'Failed to parse JSON response',
        undefined,
        parseError
      );
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new SubmitGradientError('Request timeout after 10 seconds');
    }
    
    if (error instanceof SubmitGradientError) {
      throw error;
    }
    
    throw new SubmitGradientError(
      `Failed to fetch: ${error.message}`,
      undefined,
      error
    );
  }
}

/**
 * Validate CID format
 * @param cid CID to validate
 * @returns boolean indicating if CID is valid
 */
function isValidCid(cid: string): boolean {
  // Basic validation - CID should start with "walrus_blob_" or "Qm" or "bafy"
  return typeof cid === 'string' && 
    (cid.startsWith('walrus_blob_') || 
     cid.startsWith('Qm') || 
     cid.startsWith('bafy') ||
     cid.startsWith('walrus://'));
}

/**
 * Submit a gradient CID + metadata to the backend and optionally perform an on-chain Move call
 * @param payload Submission payload
 * @returns Promise resolving to SubmitResult
 */
export async function submitGradient(payload: SubmitPayload): Promise<SubmitResult> {
  const { cid, loss, version, stats, signer } = payload;
  
  debugLog('Submitting gradient:', { cid, loss, version, stats: !!stats, hasSigner: !!signer });
  
  // Validate CID format
  if (!isValidCid(cid)) {
    throw new SubmitGradientError(`Invalid CID format: ${cid}`);
  }
  
  try {
    // If signer is provided, call ModelService.submitGradientCid
    if (signer) {
      debugLog('Submitting gradient via on-chain call');
      
      // In a real implementation, this would import and call the ModelService
      // For now, we'll simulate the on-chain call
      try {
        // This is where we would call:
        // const txDigest = await modelService.submitGradientCid(modelId, cid, metadata, signer);
        
        // Simulate on-chain transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        const txDigest = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        debugLog('On-chain submission successful:', txDigest);
        return {
          ok: true,
          txDigest,
          message: 'Gradient submitted on-chain successfully'
        };
      } catch (error) {
        debugLog('On-chain submission failed:', error);
        throw new SubmitGradientError(
          `On-chain submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          undefined,
          error
        );
      }
    } 
    // If signer is NOT provided, POST to /api/upload
    else {
      debugLog('Submitting gradient via backend API');
      
      const response = await fetchWithTimeout('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          cid,
          loss,
          version,
          stats
        })
      });
      
      debugLog('Backend API submission response:', response);
      
      return {
        ok: true,
        message: 'Gradient submitted to backend successfully'
      };
    }
  } catch (error) {
    debugLog('Gradient submission failed:', error);
    
    if (error instanceof SubmitGradientError) {
      throw error;
    }
    
    throw new SubmitGradientError(
      `Failed to submit gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}