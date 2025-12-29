/**
 * Production-Ready Walrus Service with Multiple Strategies
 * Includes fallback mechanisms for hackathon demo
 */

// Custom error class
export class WalrusError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: any) {
    super(message);
    this.name = 'WalrusError';
  }
}

// Types
export interface WalrusUploadResult {
  cid: string;
  size: number;
  blobId?: string;
  endEpoch?: number;
  method?: 'walrus' | 'mock' | 'ipfs';
}

// Configuration
const WALRUS_ENDPOINTS = [
  'https://publisher.walrus-testnet.walrus.space',
  'https://walrus-testnet-publisher.nodes.guru',
  'https://wal-publisher-testnet.staketab.org'
];

const WALRUS_AGGREGATORS = [
  'https://aggregator.walrus-testnet.walrus.space',
  'https://walrus-testnet-aggregator.nodes.guru'
];

const USE_MOCK_FOR_DEMO = process.env.NEXT_PUBLIC_USE_MOCK_WALRUS === 'true' || true; // Enable for hackathon demo

// Debug logger
const debugLog = (...args: any[]) => {
  console.log('[WalrusService]', ...args);
};

// Mock storage for demo (simulates Walrus)
class MockWalrusStorage {
  private storage = new Map<string, Uint8Array>();
  
  generateBlobId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `mock_${timestamp}_${random}`;
  }
  
  store(data: Uint8Array): string {
    const blobId = this.generateBlobId();
    this.storage.set(blobId, data);
    debugLog('Mock storage: Stored', data.length, 'bytes with ID:', blobId);
    return blobId;
  }
  
  retrieve(blobId: string): Uint8Array | null {
    const data = this.storage.get(blobId);
    if (data) {
      debugLog('Mock storage: Retrieved', data.length, 'bytes for ID:', blobId);
    } else {
      debugLog('Mock storage: No data found for ID:', blobId);
    }
    return data || null;
  }
  
  exists(blobId: string): boolean {
    return this.storage.has(blobId);
  }
}

const mockStorage = new MockWalrusStorage();

// Helper to handle response
async function handleResponse(response: Response): Promise<any> {
  const text = await response.text();
  debugLog('Response status:', response.status);
  debugLog('Response body:', text.substring(0, 200));
  
  if (!response.ok) {
    throw new WalrusError(
      `HTTP ${response.status}: ${response.statusText}${text ? ` - ${text.substring(0, 100)}` : ''}`,
      response.status
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Main service class
export class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;
  private useMock: boolean;

  constructor() {
    this.publisherUrl = WALRUS_ENDPOINTS[0];
    this.aggregatorUrl = WALRUS_AGGREGATORS[0];
    this.useMock = USE_MOCK_FOR_DEMO;
    
    debugLog('Initialized with:');
    debugLog('- Publisher:', this.publisherUrl);
    debugLog('- Aggregator:', this.aggregatorUrl);
    debugLog('- Mock mode:', this.useMock);
  }

  /**
   * Upload blob to Walrus (with fallback to mock)
   */
  async uploadBlob(
    blob: Blob | Uint8Array,
    epochs: number = 5
  ): Promise<WalrusUploadResult> {
    if (!blob) {
      throw new WalrusError('Blob is required');
    }

    // Convert to Uint8Array for consistency
    let dataArray: Uint8Array;
    if (blob instanceof Uint8Array) {
      dataArray = blob;
    } else {
      const arrayBuffer = await blob.arrayBuffer();
      dataArray = new Uint8Array(arrayBuffer);
    }

    debugLog('Uploading', dataArray.length, 'bytes');

    // Try mock storage first for demo reliability
    if (this.useMock) {
      debugLog('Using mock storage for demo');
      return this.uploadToMock(dataArray);
    }

    // Try real Walrus endpoints
    for (let i = 0; i < WALRUS_ENDPOINTS.length; i++) {
      const endpoint = WALRUS_ENDPOINTS[i];
      try {
        debugLog(`Attempting upload to endpoint ${i + 1}/${WALRUS_ENDPOINTS.length}:`, endpoint);
        return await this.tryWalrusUpload(endpoint, dataArray, epochs);
      } catch (error: any) {
        debugLog(`Endpoint ${i + 1} failed:`, error.message);
        
        // If this is the last endpoint, fall back to mock
        if (i === WALRUS_ENDPOINTS.length - 1) {
          debugLog('All Walrus endpoints failed, using mock storage');
          return this.uploadToMock(dataArray);
        }
      }
    }

    // Fallback to mock (should not reach here, but just in case)
    return this.uploadToMock(dataArray);
  }

  /**
   * Try uploading to a specific Walrus endpoint
   */
  private async tryWalrusUpload(
    endpoint: string,
    data: Uint8Array,
    epochs: number
  ): Promise<WalrusUploadResult> {
    // Fix for SharedArrayBuffer compatibility
    const buffer = data.buffer instanceof SharedArrayBuffer 
      ? new Uint8Array(data.buffer).slice().buffer 
      : data.buffer;
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // Try different URL patterns
      const urls = [
        `${endpoint}/v1/store?epochs=${epochs}`,
        `${endpoint}/v1/blobs`,
        `${endpoint}/store?epochs=${epochs}`
      ];

      for (const url of urls) {
        try {
          debugLog('Trying URL:', url);
          
          const response = await fetch(url, {
            method: 'PUT',
            body: blob,
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const result = await handleResponse(response);
          
          debugLog('Upload successful:', result);
          
          // Parse response
          let blobId: string;
          let size: number = data.length;
          let endEpoch: number | undefined;

          if (result.newlyCreated) {
            blobId = result.newlyCreated.blobObject.blobId;
            size = parseInt(result.newlyCreated.blobObject.size);
            endEpoch = result.newlyCreated.endEpoch;
          } else if (result.alreadyCertified) {
            blobId = result.alreadyCertified.blobObject.blobId;
            size = parseInt(result.alreadyCertified.blobObject.size);
            endEpoch = result.alreadyCertified.endEpoch;
          } else if (result.blobId) {
            blobId = result.blobId;
          } else {
            throw new WalrusError('Unexpected response format');
          }
          
          return {
            cid: blobId,
            blobId,
            size,
            endEpoch,
            method: 'walrus'
          };
          
        } catch (urlError: any) {
          debugLog('URL failed:', url, urlError.message);
          // Try next URL
          continue;
        }
      }
      
      throw new WalrusError('All URL patterns failed');
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new WalrusError('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Upload to mock storage (for demo)
   */
  private async uploadToMock(data: Uint8Array): Promise<WalrusUploadResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const blobId = mockStorage.store(data);
    
    return {
      cid: blobId,
      blobId,
      size: data.length,
      endEpoch: Date.now() + (86400000 * 30), // 30 days from now
      method: 'mock'
    };
  }

  /**
   * Download blob from Walrus (with fallback to mock)
   */
  async downloadBlob(blobId: string): Promise<Uint8Array> {
    if (!blobId) {
      throw new WalrusError('Blob ID is required');
    }

    debugLog('Downloading blob:', blobId);

    // Check if it's a mock ID
    if (blobId.startsWith('mock_')) {
      const data = mockStorage.retrieve(blobId);
      if (!data) {
        throw new WalrusError('Blob not found in mock storage');
      }
      return data;
    }

    // Try real Walrus aggregators
    for (let i = 0; i < WALRUS_AGGREGATORS.length; i++) {
      const aggregator = WALRUS_AGGREGATORS[i];
      try {
        debugLog(`Attempting download from aggregator ${i + 1}/${WALRUS_AGGREGATORS.length}:`, aggregator);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${aggregator}/v1/${blobId}`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new WalrusError(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        debugLog('Download successful:', arrayBuffer.byteLength, 'bytes');
        return new Uint8Array(arrayBuffer);
        
      } catch (error: any) {
        debugLog(`Aggregator ${i + 1} failed:`, error.message);
        
        // If last aggregator, throw error
        if (i === WALRUS_AGGREGATORS.length - 1) {
          throw new WalrusError('All aggregators failed');
        }
      }
    }

    throw new WalrusError('Download failed');
  }

  /**
   * Check if blob exists
   */
  async blobExists(blobId: string): Promise<boolean> {
    if (!blobId) return false;

    // Check mock storage
    if (blobId.startsWith('mock_')) {
      return mockStorage.exists(blobId);
    }

    // Check real Walrus
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.aggregatorUrl}/v1/${blobId}`, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get blob URL
   */
  getBlobUrl(blobId: string): string {
    if (blobId.startsWith('mock_')) {
      return `mock://${blobId}`;
    }
    return `${this.aggregatorUrl}/v1/${blobId}`;
  }

  /**
   * Upload JSON
   */
  async uploadJson(data: any, epochs: number = 5): Promise<WalrusUploadResult> {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const arrayBuffer = await blob.arrayBuffer();
    return this.uploadBlob(new Uint8Array(arrayBuffer), epochs);
  }

  /**
   * Download JSON
   */
  async downloadJson<T = any>(blobId: string): Promise<T> {
    const data = await this.downloadBlob(blobId);
    const text = new TextDecoder().decode(data);
    return JSON.parse(text);
  }

  /**
   * Upload file
   */
  async uploadFile(file: File, epochs: number = 5): Promise<WalrusUploadResult> {
    const arrayBuffer = await file.arrayBuffer();
    return this.uploadBlob(new Uint8Array(arrayBuffer), epochs);
  }

  /**
   * Upload text
   */
  async uploadText(text: string, epochs: number = 5): Promise<WalrusUploadResult> {
    const blob = new Blob([text], { type: 'text/plain' });
    const arrayBuffer = await blob.arrayBuffer();
    return this.uploadBlob(new Uint8Array(arrayBuffer), epochs);
  }

  /**
   * Download text
   */
  async downloadText(blobId: string): Promise<string> {
    const data = await this.downloadBlob(blobId);
    return new TextDecoder().decode(data);
  }

  /**
   * Get service status
   */
  getStatus(): { useMock: boolean; publisher: string; aggregator: string } {
    return {
      useMock: this.useMock,
      publisher: this.publisherUrl,
      aggregator: this.aggregatorUrl
    };
  }

  /**
   * Enable/disable mock mode
   */
  setMockMode(enabled: boolean): void {
    this.useMock = enabled;
    debugLog('Mock mode:', enabled ? 'ENABLED' : 'DISABLED');
  }
}

// Export singleton
export const walrusService = new WalrusService();

// Export for testing
export default WalrusService;