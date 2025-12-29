import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TrainingSession {
  id: string;
  modelId: string;
  modelType: 'cnn' | 'rnn' | 'transformer' | 'mlp';
  status: 'idle' | 'preparing' | 'training' | 'paused' | 'uploading' | 'completed' | 'failed';
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  startTime: Date;
  endTime?: Date;
  walrusCID?: string;
  error?: string;
  hyperparameters: {
    epochs: number;
    batchSize: number;
    learningRate: number;
  };
}

export interface TrainingHistoryEntry {
  sessionId: string;
  timestamp: Date;
  modelType: string;
  finalLoss: number;
  finalAccuracy: number;
  duration: number;
  walrusCID?: string;
}

interface TrainingState {
  // Current session
  currentSession: TrainingSession | null;
  
  // Session history
  sessions: TrainingSession[];
  history: TrainingHistoryEntry[];
  
  // Statistics
  totalSessionsCompleted: number;
  totalTrainingTime: number;
  
  // Actions
  createSession: (modelId: string, modelType: TrainingSession['modelType'], hyperparameters: TrainingSession['hyperparameters']) => string;
  updateSession: (sessionId: string, updates: Partial<TrainingSession>) => void;
  completeSession: (sessionId: string, result: { loss: number; accuracy: number; walrusCID?: string }) => void;
  failSession: (sessionId: string, error: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  getSession: (sessionId: string) => TrainingSession | undefined;
  clearHistory: () => void;
  removeSession: (sessionId: string) => void;
  
  // Computed values
  getActiveSession: () => TrainingSession | null;
  getRecentSessions: (limit?: number) => TrainingSession[];
  getSessionsByModelType: (modelType: string) => TrainingSession[];
  getAverageAccuracy: () => number;
  getAverageLoss: () => number;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      history: [],
      totalSessionsCompleted: 0,
      totalTrainingTime: 0,
      
      createSession: (modelId, modelType, hyperparameters) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newSession: TrainingSession = {
          id: sessionId,
          modelId,
          modelType,
          status: 'idle',
          progress: 0,
          currentEpoch: 0,
          totalEpochs: hyperparameters.epochs,
          loss: 0,
          accuracy: 0,
          startTime: new Date(),
          hyperparameters
        };
        
        set(state => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession
        }));
        
        return sessionId;
      },
      
      updateSession: (sessionId, updates) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, ...updates }
              : session
          ),
          currentSession: state.currentSession?.id === sessionId
            ? { ...state.currentSession, ...updates }
            : state.currentSession
        }));
      },
      
      completeSession: (sessionId, result) => {
        const session = get().sessions.find(s => s.id === sessionId);
        
        if (session) {
          const endTime = new Date();
          const duration = endTime.getTime() - session.startTime.getTime();
          
          const historyEntry: TrainingHistoryEntry = {
            sessionId,
            timestamp: endTime,
            modelType: session.modelType,
            finalLoss: result.loss,
            finalAccuracy: result.accuracy,
            duration,
            walrusCID: result.walrusCID
          };
          
          set(state => ({
            sessions: state.sessions.map(s =>
              s.id === sessionId
                ? {
                    ...s,
                    status: 'completed',
                    progress: 100,
                    loss: result.loss,
                    accuracy: result.accuracy,
                    endTime,
                    walrusCID: result.walrusCID
                  }
                : s
            ),
            history: [...state.history, historyEntry],
            totalSessionsCompleted: state.totalSessionsCompleted + 1,
            totalTrainingTime: state.totalTrainingTime + duration,
            currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
          }));
        }
      },
      
      failSession: (sessionId, error) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  status: 'failed',
                  error,
                  endTime: new Date()
                }
              : s
          ),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }));
      },
      
      setCurrentSession: (sessionId) => {
        const session = sessionId ? get().sessions.find(s => s.id === sessionId) : null;
        set({ currentSession: session || null });
      },
      
      getSession: (sessionId) => {
        return get().sessions.find(s => s.id === sessionId);
      },
      
      clearHistory: () => {
        set({
          sessions: get().sessions.filter(s => s.status === 'training' || s.status === 'paused'),
          history: [],
          totalSessionsCompleted: 0,
          totalTrainingTime: 0
        });
      },
      
      removeSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          history: state.history.filter(h => h.sessionId !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }));
      },
      
      // Computed values
      getActiveSession: () => {
        const state = get();
        return state.sessions.find(
          s => s.status === 'training' || s.status === 'paused' || s.status === 'uploading'
        ) || null;
      },
      
      getRecentSessions: (limit = 10) => {
        const sessions = get().sessions;
        return [...sessions]
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .slice(0, limit);
      },
      
      getSessionsByModelType: (modelType) => {
        return get().sessions.filter(s => s.modelType === modelType);
      },
      
      getAverageAccuracy: () => {
        const completedSessions = get().sessions.filter(s => s.status === 'completed');
        if (completedSessions.length === 0) return 0;
        
        const totalAccuracy = completedSessions.reduce((sum, s) => sum + s.accuracy, 0);
        return totalAccuracy / completedSessions.length;
      },
      
      getAverageLoss: () => {
        const completedSessions = get().sessions.filter(s => s.status === 'completed');
        if (completedSessions.length === 0) return 0;
        
        const totalLoss = completedSessions.reduce((sum, s) => sum + s.loss, 0);
        return totalLoss / completedSessions.length;
      }
    }),
    {
      name: 'sui-dat-training-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions.filter(s => s.status === 'completed' || s.status === 'failed'),
        history: state.history,
        totalSessionsCompleted: state.totalSessionsCompleted,
        totalTrainingTime: state.totalTrainingTime
      })
    }
  )
);