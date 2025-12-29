'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTraining } from '@/lib/hooks/use-training';
import { useTrainingStore } from '@/store/useTrainingStore';

interface TrainingContextType extends ReturnType<typeof useTraining> {
  // Store methods
  createStoreSession: (modelId: string, modelType: any, hyperparameters: any) => string;
  updateStoreSession: (sessionId: string, updates: any) => void;
  completeStoreSession: (sessionId: string, result: any) => void;
  failStoreSession: (sessionId: string, error: string) => void;
  
  // Store state
  storeSessions: any[];
  storeHistory: any[];
  totalSessionsCompleted: number;
  totalTrainingTime: number;
  
  // Computed
  getActiveSession: () => any;
  getRecentSessions: (limit?: number) => any[];
  getAverageAccuracy: () => number;
  getAverageLoss: () => number;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const training = useTraining();
  const trainingStore = useTrainingStore();
  
  // Sync training hook with store
  useEffect(() => {
    if (training.sessionId && training.status !== 'idle') {
      const existingSession = trainingStore.getSession(training.sessionId);
      
      if (!existingSession && training.progress) {
        // Create new session in store
        trainingStore.createSession(
          training.sessionId,
          'mlp', // Default, should be passed from training options
          {
            epochs: 10,
            batchSize: 32,
            learningRate: 0.001
          }
        );
      }
      
      // Update session with current progress only if there are actual changes
      if (training.progress && existingSession) {
        // Check if there are actual changes to avoid infinite loop
        const hasChanges = 
          existingSession.status !== training.status ||
          existingSession.progress !== training.progress.percentage ||
          existingSession.currentEpoch !== training.progress.epoch ||
          existingSession.loss !== training.progress.loss ||
          existingSession.accuracy !== (training.progress.accuracy || 0);
        
        if (hasChanges) {
          trainingStore.updateSession(training.sessionId, {
            status: training.status,
            progress: training.progress.percentage,
            currentEpoch: training.progress.epoch,
            loss: training.progress.loss,
            accuracy: training.progress.accuracy || 0
          });
        }
      }
    }
  }, [training.sessionId, training.status, training.progress]);
  
  // Handle completion
  useEffect(() => {
    if (training.status === 'completed' && training.sessionId && training.result) {
      const existingSession = trainingStore.getSession(training.sessionId);
      // Only complete if the session exists and isn't already completed
      if (existingSession && existingSession.status !== 'completed') {
        trainingStore.completeSession(training.sessionId, {
          loss: training.result.metadata.finalLoss,
          accuracy: training.result.metadata.finalAccuracy,
          walrusCID: training.walrusCID || undefined
        });
      }
    }
  }, [training.status, training.sessionId, training.result, training.walrusCID]);
  
  // Handle failure
  useEffect(() => {
    if (training.status === 'failed' && training.sessionId && training.error) {
      const existingSession = trainingStore.getSession(training.sessionId);
      // Only fail if the session exists and isn't already failed
      if (existingSession && existingSession.status !== 'failed') {
        trainingStore.failSession(training.sessionId, training.error);
      }
    }
  }, [training.status, training.sessionId, training.error]);
  
  const contextValue: TrainingContextType = {
    ...training,
    createStoreSession: trainingStore.createSession,
    updateStoreSession: trainingStore.updateSession,
    completeStoreSession: trainingStore.completeSession,
    failStoreSession: trainingStore.failSession,
    storeSessions: trainingStore.sessions,
    storeHistory: trainingStore.history,
    totalSessionsCompleted: trainingStore.totalSessionsCompleted,
    totalTrainingTime: trainingStore.totalTrainingTime,
    getActiveSession: trainingStore.getActiveSession,
    getRecentSessions: trainingStore.getRecentSessions,
    getAverageAccuracy: trainingStore.getAverageAccuracy,
    getAverageLoss: trainingStore.getAverageLoss
  };
  
  return (
    <TrainingContext.Provider value={contextValue}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTrainingContext() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTrainingContext must be used within a TrainingProvider');
  }
  return context;
}