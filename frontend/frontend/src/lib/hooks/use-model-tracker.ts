'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestModel, ModelInfo } from '@/lib/api/fetch-model';

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  createdAt: Date;
  contributors: number;
  walrusCID: string;
  status: 'active' | 'archived' | 'training';
}

export interface ModelContribution {
  id: string;
  modelId: string;
  contributorAddress: string;
  timestamp: Date;
  accuracyImprovement: number;
  gradientCID: string;
  status: 'pending' | 'validated' | 'rejected';
}

export interface TrainingMetrics {
  totalTrainingHours: number;
  activeParticipants: number;
  completedSessions: number;
  dataProcessed: string;
  averageAccuracyGain: number;
}

interface UseModelTrackerOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useModelTracker(options: UseModelTrackerOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null);
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [contributions, setContributions] = useState<ModelContribution[]>([]);
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);

  // Fetch current model and related data
  const fetchData = useCallback(async (silent = false) => {
    // Prevent concurrent refreshes
    if (isRefreshing.current) return;
    
    isRefreshing.current = true;
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      // Fetch latest model
      const modelData = await fetchLatestModel();
      setCurrentModel(modelData);

      // Transform to ModelVersion format
      const modelVersion: ModelVersion = {
        id: `model_${modelData.version}`,
        name: modelData.name,
        version: modelData.version.toString(),
        accuracy: 0, // Will be calculated from metrics
        createdAt: new Date(modelData.updatedAt),
        contributors: modelData.contributorCount,
        walrusCID: modelData.weightsCid,
        status: 'active',
      };

      setModels(prev => {
        // Add new version if not exists
        const exists = prev.some(m => m.id === modelVersion.id);
        if (!exists) {
          return [modelVersion, ...prev];
        }
        return prev.map(m => m.id === modelVersion.id ? modelVersion : m);
      });

      // Process contributions from pending gradients
      if (modelData.pendingGradients) {
        const newContributions: ModelContribution[] = modelData.pendingGradients.map((grad, idx) => ({
          id: `contrib_${grad.cid}_${idx}`,
          modelId: `model_${modelData.version}`,
          contributorAddress: grad.contributor,
          timestamp: new Date(grad.timestamp),
          accuracyImprovement: grad.metadata?.accuracy || 0,
          gradientCID: grad.cid,
          status: grad.validated ? 'validated' : 'pending' as const,
        }));

        setContributions(newContributions);
      }

      // Calculate training metrics
      const trainingMetrics: TrainingMetrics = {
        totalTrainingHours: modelData.gradientCount * 0.5, // Estimated
        activeParticipants: modelData.contributorCount,
        completedSessions: modelData.gradientCount,
        dataProcessed: `${(modelData.gradientCount * 100 / 1024).toFixed(2)} GB`,
        averageAccuracyGain: 0.5, // Placeholder
      };

      setMetrics(trainingMetrics);
      setLastUpdated(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch model data';
      setError(errorMessage);
      console.error('Model tracker error:', err);
    } finally {
      setIsLoading(false);
      isRefreshing.current = false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(true); // Silent refresh
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  // Manual refresh
  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Get current model
  const getCurrentModel = useCallback(() => {
    return currentModel;
  }, [currentModel]);

  // Get model history
  const getModelHistory = useCallback(() => {
    return models;
  }, [models]);

  // Get user contributions
  const getUserContributions = useCallback((address: string) => {
    return contributions.filter(
      contrib => contrib.contributorAddress.toLowerCase() === address.toLowerCase()
    );
  }, [contributions]);

  // Get model by version
  const getModelByVersion = useCallback((version: string) => {
    return models.find(m => m.version === version) || null;
  }, [models]);

  // Get contributions for model
  const getModelContributions = useCallback((modelId: string) => {
    return contributions.filter(c => c.modelId === modelId);
  }, [contributions]);

  // Calculate contribution stats
  const getContributionStats = useCallback((address: string) => {
    const userContribs = getUserContributions(address);
    
    return {
      total: userContribs.length,
      validated: userContribs.filter(c => c.status === 'validated').length,
      pending: userContribs.filter(c => c.status === 'pending').length,
      rejected: userContribs.filter(c => c.status === 'rejected').length,
      totalImprovement: userContribs.reduce((sum, c) => sum + c.accuracyImprovement, 0),
      averageImprovement: userContribs.length > 0 
        ? userContribs.reduce((sum, c) => sum + c.accuracyImprovement, 0) / userContribs.length 
        : 0,
    };
  }, [getUserContributions]);

  return {
    // Data
    currentModel,
    models,
    contributions,
    metrics,
    
    // State
    isLoading,
    error,
    lastUpdated,
    
    // Methods
    refresh,
    getCurrentModel,
    getModelHistory,
    getUserContributions,
    getModelByVersion,
    getModelContributions,
    getContributionStats,
  };
}

// Hook for specific model tracking
export function useModelVersion(versionId: string) {
  const { models, contributions, isLoading } = useModelTracker();
  const [model, setModel] = useState<ModelVersion | null>(null);
  const [modelContributions, setModelContributions] = useState<ModelContribution[]>([]);

  useEffect(() => {
    const foundModel = models.find(m => m.id === versionId);
    setModel(foundModel || null);
    
    if (foundModel) {
      const contribs = contributions.filter(c => c.modelId === foundModel.id);
      setModelContributions(contribs);
    }
  }, [versionId, models, contributions]);

  return {
    model,
    contributions: modelContributions,
    isLoading,
  };
}