// Core Model Types
export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  createdAt: Date;
  contributors: number;
  downloadUrl: string;
  size: string;
  parameters: string;
  description: string;
  walrusCID: string;
  status: 'active' | 'archived' | 'training';
  trainingProgress?: number;
}

// Model History
export interface ModelHistoryItem {
  id: string;
  version: string;
  accuracy: number;
  date: string;
  contributors: number;
  changes: string;
  walrusCID: string;
  improvements: string[];
  metrics: ModelMetrics;
}

// Model Metrics
export interface ModelMetrics {
  accuracy: number;
  loss: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  trainingTime: number;
  datasetSize: number;
}

// Model Contribution
export interface ModelContribution {
  id: string;
  modelId: string;
  contributorAddress: string;
  timestamp: Date;
  accuracyImprovement: number;
  gradientCID: string;
  status: 'pending' | 'validated' | 'rejected';
  validationScore?: number;
  metadata?: Record<string, any>;
}

// Training Session
export interface TrainingSession {
  id: string;
  modelId: string;
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed' | 'failed';
  participantCount: number;
  totalGradients: number;
  averageAccuracy: number;
  epochsCompleted: number;
}

// Model State
export interface ModelState {
  weights: Float32Array;
  shape: number[];
  version: number;
  metadata?: Record<string, any>;
}

// Gradient Reference
export interface GradientRef {
  contributor: string;
  cid: string;
  timestamp: number;
  validated: boolean;
  metadata?: Record<string, any>;
  validationScore?: number;
}

// Model Info from Blockchain
export interface ModelInfo {
  name: string;
  description: string;
  version: number;
  latestWeightsCid: string;
  owner: string;
  totalContributions?: number;
  lastUpdated?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// WebSocket Message Types
export interface WSMessage {
  type: 'model_update' | 'contribution_added' | 'training_progress' | 'metrics_update';
  payload: any;
  timestamp: number;
}

// Model Comparison
export interface ModelComparison {
  model1: ModelVersion;
  model2: ModelVersion;
  accuracyDiff: number;
  sizeDiff: string;
  parametersDiff: string;
  improvements: string[];
}

// Contributor Stats
export interface ContributorStats {
  address: string;
  totalContributions: number;
  totalImprovements: number;
  rank: number;
  lastContribution?: Date;
  averageImpact: number;
}

// Training Statistics
export interface TrainingStatistics {
  totalTrainingHours: number;
  activeParticipants: number;
  completedSessions: number;
  dataProcessed: string;
  averageAccuracyGain: number;
  totalModels: number;
}