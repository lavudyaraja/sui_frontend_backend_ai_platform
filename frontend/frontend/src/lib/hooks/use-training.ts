'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  trainingService,
  StartTrainingOptions,
  TrainingResult,
  ProgressUpdate,
  LogEntry,
  EpochMetrics
} from '@/services/training.service';

export interface TrainingState {
  sessionId: string | null;
  status: 'idle' | 'preparing' | 'training' | 'paused' | 'uploading' | 'completed' | 'failed';
  progress: ProgressUpdate | null;
  logs: LogEntry[];
  epochMetrics: EpochMetrics[];
  result: TrainingResult | null;
  error: string | null;
  walrusCID: string | null;
  isTraining: boolean;
  isPaused: boolean;
}

export function useTraining() {
  const [state, setState] = useState<TrainingState>({
    sessionId: null,
    status: 'idle',
    progress: null,
    logs: [],
    epochMetrics: [],
    result: null,
    error: null,
    walrusCID: null,
    isTraining: false,
    isPaused: false
  });
  
  const trainingPromiseRef = useRef<Promise<TrainingResult> | null>(null);
  
  // Add log entry
  const addLog = useCallback((log: LogEntry) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, log]
    }));
  }, []);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    setState(prev => ({
      ...prev,
      logs: []
    }));
  }, []);
  
  // Start training
  const startTraining = useCallback(async (options: StartTrainingOptions) => {
    try {
      setState(prev => ({
        ...prev,
        sessionId: `session_${Date.now()}`,
        status: 'preparing',
        progress: null,
        epochMetrics: [],
        result: null,
        error: null,
        walrusCID: null,
        isTraining: true,
        isPaused: false
      }));
      
      clearLogs();
      addLog({
        timestamp: new Date(),
        level: 'info',
        message: 'Initializing training session...'
      });
      
      const trainingOptions: StartTrainingOptions = {
        ...options,
        onProgress: (progress) => {
          setState(prev => ({
            ...prev,
            progress,
            status: 'training'
          }));
        },
        onLog: (log) => {
          addLog(log);
        },
        onEpochComplete: (metrics) => {
          setState(prev => ({
            ...prev,
            epochMetrics: [...prev.epochMetrics, metrics]
          }));
        }
      };
      
      trainingPromiseRef.current = trainingService.startLocalTraining(trainingOptions);
      const result = await trainingPromiseRef.current;
      
      setState(prev => ({
        ...prev,
        result,
        status: 'completed',
        isTraining: false
      }));
      
      addLog({
        timestamp: new Date(),
        level: 'success',
        message: 'Training completed successfully!'
      });
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: errorMessage,
        isTraining: false,
        isPaused: false
      }));
      
      addLog({
        timestamp: new Date(),
        level: 'error',
        message: `Training failed: ${errorMessage}`
      });
      
      throw error;
    } finally {
      trainingPromiseRef.current = null;
    }
  }, [addLog, clearLogs]);
  
  // Pause training
  const pauseTraining = useCallback(() => {
    trainingService.pauseTraining();
    setState(prev => ({
      ...prev,
      status: 'paused',
      isPaused: true
    }));
    
    addLog({
      timestamp: new Date(),
      level: 'info',
      message: 'Training paused'
    });
  }, [addLog]);
  
  // Resume training
  const resumeTraining = useCallback(() => {
    trainingService.resumeTraining();
    setState(prev => ({
      ...prev,
      status: 'training',
      isPaused: false
    }));
    
    addLog({
      timestamp: new Date(),
      level: 'info',
      message: 'Training resumed'
    });
  }, [addLog]);
  
  // Stop training
  const stopTraining = useCallback(async () => {
    await trainingService.stopTraining();
    setState(prev => ({
      ...prev,
      status: 'idle',
      isTraining: false,
      isPaused: false
    }));
    
    addLog({
      timestamp: new Date(),
      level: 'warning',
      message: 'Training stopped by user'
    });
  }, [addLog]);
  
  // Upload to Walrus
  const uploadToWalrus = useCallback(async (result: TrainingResult) => {
    try {
      setState(prev => ({
        ...prev,
        status: 'uploading'
      }));
      
      addLog({
        timestamp: new Date(),
        level: 'info',
        message: 'Uploading gradients to Walrus storage...'
      });
      
      const { cid, url } = await trainingService.uploadToWalrus(result);
      
      setState(prev => ({
        ...prev,
        walrusCID: cid,
        status: 'completed'
      }));
      
      addLog({
        timestamp: new Date(),
        level: 'success',
        message: `Successfully uploaded to Walrus: ${cid}`,
        data: { cid, url }
      });
      
      return { cid, url };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      addLog({
        timestamp: new Date(),
        level: 'error',
        message: `Walrus upload failed: ${errorMessage}`
      });
      
      throw error;
    }
  }, [addLog]);
  
  // Reset training state
  const resetTraining = useCallback(() => {
    setState({
      sessionId: null,
      status: 'idle',
      progress: null,
      logs: [],
      epochMetrics: [],
      result: null,
      error: null,
      walrusCID: null,
      isTraining: false,
      isPaused: false
    });
  }, []);
  
  // Get training statistics
  const getStatistics = useCallback(() => {
    if (!state.result) return null;
    
    const { stats, metadata } = state.result;
    
    return {
      totalEpochs: stats.loss.length,
      finalLoss: metadata.finalLoss,
      finalAccuracy: metadata.finalAccuracy,
      bestLoss: Math.min(...stats.loss),
      bestAccuracy: Math.max(...stats.accuracy),
      averageLoss: stats.loss.reduce((a, b) => a + b, 0) / stats.loss.length,
      averageAccuracy: stats.accuracy.reduce((a, b) => a + b, 0) / stats.accuracy.length,
      totalDuration: metadata.totalDuration,
      modelType: metadata.modelType
    };
  }, [state.result]);
  
  return {
    ...state,
    startTraining,
    pauseTraining,
    resumeTraining,
    stopTraining,
    uploadToWalrus,
    resetTraining,
    clearLogs,
    getStatistics
  };
}