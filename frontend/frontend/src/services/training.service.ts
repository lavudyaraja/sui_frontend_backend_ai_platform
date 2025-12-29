import { walrusService, WalrusError } from './walrus.service';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[TrainingService]', ...args);
  }
};

// Type definitions
export interface StartTrainingOptions {
  dataset?: File | Blob;
  datasetCID?: string;
  epochs?: number;
  batchSize?: number;
  learningRate?: number;
  modelType?: 'cnn' | 'rnn' | 'transformer' | 'mlp';
  onProgress?: (progress: ProgressUpdate) => void;
  onLog?: (log: LogEntry) => void;
  onEpochComplete?: (epoch: EpochMetrics) => void;
}

export interface ProgressUpdate {
  epoch: number;
  batch: number;
  totalBatches: number;
  loss: number;
  accuracy?: number;
  percentage: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export interface EpochMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss?: number;
  validationAccuracy?: number;
  learningRate: number;
  duration: number;
}

export interface ModelState {
  weights: Float32Array | number[];
  biases?: Float32Array | number[];
  metadata: {
    modelType: string;
    version: string;
    architecture: any;
    hyperparameters: any;
  };
}

export interface TrainingResult {
  gradientsBlob: Uint8Array;
  stats: {
    loss: number[];
    accuracy: number[];
    validationLoss?: number[];
    validationAccuracy?: number[];
    epochMetrics: EpochMetrics[];
  };
  metadata: {
    totalDuration: number;
    averageBatchTime: number;
    finalLoss: number;
    finalAccuracy: number;
    modelType: string;
    hyperparameters: any;
  };
}

export interface TrainingSession {
  id: string;
  status: 'idle' | 'preparing' | 'training' | 'paused' | 'uploading' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  options: StartTrainingOptions;
  result?: TrainingResult;
  error?: string;
}

// Helper to get base URL
function getBaseUrl(): string {
  // Browser environment
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // Server environment
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
}

// Training service class
export class TrainingService {
  private sessionId: string | null = null;
  private abortController: AbortController | null = null;
  private currentSession: TrainingSession | null = null;
  private sessions: Map<string, TrainingSession> = new Map();
  
  /**
   * Start local training
   */
  async startLocalTraining(options: StartTrainingOptions): Promise<TrainingResult> {
    const {
      dataset,
      datasetCID,
      epochs = 10,
      batchSize = 32,
      learningRate = 0.001,
      modelType = 'mlp',
      onProgress,
      onLog,
      onEpochComplete
    } = options;
    
    const startTime = Date.now();
    
    this.log(onLog, 'info', `Starting training session with backend API`);
    this.log(onLog, 'info', `Configuration: ${epochs} epochs, batch size ${batchSize}, LR ${learningRate}`);
    
    // Log dataset information
    if (datasetCID) {
      this.log(onLog, 'info', `Using dataset with CID: ${datasetCID}`);
    } else if (dataset) {
      this.log(onLog, 'info', `Using provided dataset: ${dataset instanceof File ? dataset.name : 'Blob'}`);
    } else {
      this.log(onLog, 'warning', 'No dataset provided, using synthetic data');
    }
    
    try {
      const baseUrl = getBaseUrl();
      const startUrl = `${baseUrl}/api/local-training/start`;
      
      // Start training session with backend
      const startResponse = await fetch(startUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelType,
          epochs,
          batchSize,
          learningRate,
          datasetCID
        })
      });
      
      if (!startResponse.ok) {
        let errorMessage = 'Failed to start training session';
        try {
          const errorData = await startResponse.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = startResponse.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const startData = await startResponse.json();
      this.sessionId = startData.session_id;
      
      this.log(onLog, 'info', `Training session started with ID: ${this.sessionId}`);
      
      // Poll for training status
      if (this.sessionId && typeof this.sessionId === 'string') {
        return await this.pollTrainingStatus(this.sessionId, onProgress, onLog, onEpochComplete);
      } else {
        throw new Error('Failed to get session ID from backend');
      }
      
    } catch (error) {
      this.log(onLog, 'error', `Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Poll training status until completion
   */
  private async pollTrainingStatus(
    sessionId: string,
    onProgress?: (progress: ProgressUpdate) => void,
    onLog?: (log: LogEntry) => void,
    onEpochComplete?: (epoch: EpochMetrics) => void
  ): Promise<TrainingResult> {
    let lastEpoch = 0;
    let lastProgress: ProgressUpdate | null = null;
    const baseUrl = getBaseUrl();
    
    while (true) {
      try {
        const response = await fetch(`${baseUrl}/api/local-training/status/${sessionId}`);
        
        if (!response.ok) {
          let errorMessage = 'Failed to get training status';
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const status = await response.json();
        
        // Handle different statuses
        switch (status.status) {
          case 'completed':
            this.log(onLog, 'success', 'Training completed successfully!');
            return this.convertTrainingResult(status.result);
            
          case 'failed':
            throw new Error(status.error || 'Training failed');
            
          case 'stopped':
            throw new Error('Training was stopped by user');
            
          case 'paused':
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
            
          case 'training':
          case 'preparing':
            if (status.progress) {
              if (!lastProgress || 
                  lastProgress.epoch !== status.progress.epoch || 
                  lastProgress.batch !== status.progress.batch) {
                if (onProgress) {
                  onProgress(status.progress);
                }
                lastProgress = status.progress;
              }
            }
            
            if (status.epochMetrics && status.epochMetrics.length > lastEpoch) {
              const newEpochMetrics = status.epochMetrics[status.epochMetrics.length - 1];
              if (onEpochComplete) {
                onEpochComplete({
                  epoch: newEpochMetrics.epoch,
                  loss: newEpochMetrics.loss,
                  accuracy: newEpochMetrics.accuracy,
                  learningRate: status.learningRate || 0.001,
                  duration: 0
                });
              }
              lastEpoch = status.epochMetrics.length;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            break;
            
          default:
            await new Promise(resolve => setTimeout(resolve, 1000));
            break;
        }
      } catch (error) {
        this.log(onLog, 'error', `Failed to poll training status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    }
  }
  
  /**
   * Convert backend training result to frontend format
   */
  private convertTrainingResult(backendResult: any): TrainingResult {
    if (!backendResult) {
      throw new Error('Invalid training result from backend');
    }
    
    let gradientsBlob: Uint8Array;
    if (backendResult.gradients) {
      const gradientsJson = JSON.stringify(backendResult.gradients);
      const encoder = new TextEncoder();
      gradientsBlob = encoder.encode(gradientsJson);
    } else if (backendResult.gradientsBlob) {
      gradientsBlob = new Uint8Array(backendResult.gradientsBlob);
    } else {
      gradientsBlob = new Uint8Array(0);
    }
    
    return {
      gradientsBlob,
      stats: {
        loss: backendResult.stats?.loss || [],
        accuracy: backendResult.stats?.accuracy || [],
        validationLoss: backendResult.stats?.validationLoss,
        validationAccuracy: backendResult.stats?.validationAccuracy,
        epochMetrics: backendResult.stats?.epochMetrics || []
      },
      metadata: {
        totalDuration: backendResult.trainingTime || 0,
        averageBatchTime: backendResult.metadata?.averageBatchTime || 0,
        finalLoss: backendResult.finalLoss || 0,
        finalAccuracy: backendResult.finalAccuracy || 0,
        modelType: backendResult.modelType || 'mlp',
        hyperparameters: backendResult.metadata?.hyperparameters || {}
      }
    };
  }
  
  async pauseTraining(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active training session');
    }
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/local-training/pause/${this.sessionId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to pause training';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
  
  async resumeTraining(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active training session');
    }
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/local-training/resume/${this.sessionId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to resume training';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
  
  async stopTraining(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active training session');
    }
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/local-training/stop/${this.sessionId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to stop training';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }

  async uploadToWalrus(result: TrainingResult): Promise<{ cid: string; url: string }> {
    if (!this.sessionId) {
      throw new Error('No active training session');
    }
    
    const baseUrl = getBaseUrl();
    // Fix for SharedArrayBuffer compatibility
    const buffer = result.gradientsBlob.buffer instanceof SharedArrayBuffer 
      ? new Uint8Array(result.gradientsBlob.buffer).slice().buffer 
      : result.gradientsBlob.buffer;
    const gradientsBlob = new Blob([buffer], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('file', gradientsBlob, 'gradients.bin');
    
    const response = await fetch(`${baseUrl}/api/local-training/upload-gradients/${this.sessionId}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to upload gradients';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const uploadResult = await response.json();
    return {
      cid: uploadResult.cid,
      url: uploadResult.url || ''
    };
  }
  
  private log(onLog: ((log: LogEntry) => void) | undefined, level: LogEntry['level'], message: string, data?: any): void {
    debugLog(message, data);
    if (onLog) {
      onLog({
        timestamp: new Date(),
        level,
        message,
        data
      });
    }
  }
}

// Export singleton instance
export const trainingService = new TrainingService();