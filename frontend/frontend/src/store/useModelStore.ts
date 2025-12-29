import { create } from 'zustand';
import React from 'react';
import { 
  fetchLatestModel, 
  createModelUpdateStream,
  ModelInfo,
  ModelUpdateStream 
} from '@/lib/api/fetch-model';

interface ModelVersion {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  createdAt: Date;
  contributors: number;
  downloadUrl: string;
  walrusCID: string;
  status: 'active' | 'archived' | 'training';
}

interface ModelState {
  // Current model data
  currentModel: ModelInfo | null;
  
  // Model history
  models: ModelVersion[];
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  
  // Error handling
  error: string | null;
  
  // Real-time updates
  updateStream: ModelUpdateStream | null;
  autoRefresh: boolean;
  lastUpdated: number | null;
  
  // Actions
  fetchModel: () => Promise<void>;
  refreshModel: () => Promise<void>;
  setCurrentModel: (model: ModelInfo) => void;
  addModel: (model: Omit<ModelVersion, 'createdAt'>) => void;
  updateModelAccuracy: (modelId: string, accuracy: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time actions
  startAutoRefresh: (interval?: number) => void;
  stopAutoRefresh: () => void;
  
  // Cleanup
  cleanup: () => void;
}

export const useModelStore = create<ModelState>((set, get) => ({
  // Initial state
  currentModel: null,
  models: [],
  loading: false,
  refreshing: false,
  error: null,
  updateStream: null,
  autoRefresh: false,
  lastUpdated: null,

  // Fetch current model
  fetchModel: async () => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const model = await fetchLatestModel();
      
      set({ 
        currentModel: model,
        loading: false,
        lastUpdated: Date.now(),
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch model:', error);
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch model',
      });
    }
  },

  // Refresh model (silent update)
  refreshModel: async () => {
    const { refreshing } = get();
    if (refreshing) return;

    set({ refreshing: true });

    try {
      const model = await fetchLatestModel();
      
      set({ 
        currentModel: model,
        refreshing: false,
        lastUpdated: Date.now(),
        error: null,
      });
    } catch (error) {
      console.error('Failed to refresh model:', error);
      set({ 
        refreshing: false,
        error: error instanceof Error ? error.message : 'Failed to refresh model',
      });
    }
  },

  // Set current model
  setCurrentModel: (model: ModelInfo) => {
    set({ 
      currentModel: model,
      lastUpdated: Date.now(),
    });
  },

  // Add model to history
  addModel: (modelData) => {
    const newModel: ModelVersion = {
      ...modelData,
      createdAt: new Date(),
    };
    
    set(state => ({
      models: [newModel, ...state.models],
    }));
  },

  // Update model accuracy
  updateModelAccuracy: (modelId, accuracy) => {
    set(state => ({
      models: state.models.map(model =>
        model.id === modelId ? { ...model, accuracy } : model
      ),
    }));
  },

  // Set loading state
  setLoading: (loading) => {
    set({ loading });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Start auto-refresh
  startAutoRefresh: (interval = 10000) => {
    const { updateStream, autoRefresh } = get();
    
    // Don't start if already running
    if (autoRefresh && updateStream) return;

    // Create new stream
    const stream = createModelUpdateStream(interval);
    
    // Listen for updates
    stream.onUpdate((model) => {
      set({ 
        currentModel: model,
        lastUpdated: Date.now(),
      });
    });
    
    // Start streaming
    stream.start();
    
    set({ 
      updateStream: stream,
      autoRefresh: true,
    });

    console.debug('Auto-refresh started with interval:', interval);
  },

  // Stop auto-refresh
  stopAutoRefresh: () => {
    const { updateStream } = get();
    
    if (updateStream) {
      updateStream.stop();
      set({ 
        updateStream: null,
        autoRefresh: false,
      });
      
      console.debug('Auto-refresh stopped');
    }
  },

  // Cleanup
  cleanup: () => {
    const { updateStream } = get();
    
    if (updateStream) {
      updateStream.stop();
    }
    
    set({
      updateStream: null,
      autoRefresh: false,
    });
  },
}));

// Selectors for optimized re-renders
export const useCurrentModel = () => useModelStore(state => state.currentModel);
export const useModelLoading = () => useModelStore(state => state.loading);
export const useModelError = () => useModelStore(state => state.error);
export const useAutoRefresh = () => useModelStore(state => state.autoRefresh);
export const useLastUpdated = () => useModelStore(state => state.lastUpdated);

// Hook for auto-refresh lifecycle
export const useModelAutoRefresh = (enabled = true, interval = 10000) => {
  const startAutoRefresh = useModelStore(state => state.startAutoRefresh);
  const stopAutoRefresh = useModelStore(state => state.stopAutoRefresh);
  const cleanup = useModelStore(state => state.cleanup);

  // Start/stop based on enabled flag
  React.useEffect(() => {
    if (enabled) {
      startAutoRefresh(interval);
    } else {
      stopAutoRefresh();
    }

    return () => {
      if (enabled) {
        cleanup();
      }
    };
  }, [enabled, interval]);
};