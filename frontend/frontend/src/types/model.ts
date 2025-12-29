/**
 * Core Model Types
 * Type definitions for the decentralized AI model system
 */

// ============================================================================
// Model Version Types
// ============================================================================

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
  status: ModelStatus;
  trainingProgress?: number;
  lastTrainingSession?: string;
}

export type ModelStatus = 'active' | 'archived' | 'training' | 'pending' | 'failed';

// ============================================================================
// Model History Types
// ============================================================================

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
  previousVersion?: string;
  changelog?: ChangelogEntry[];
}

export interface ChangelogEntry {
  type: 'feature' | 'improvement' | 'bugfix' | 'optimization';
  description: string;
  impact: 'major' | 'minor' | 'patch';
}

// ============================================================================
// Model Metrics Types
// ============================================================================

export interface ModelMetrics {
  accuracy: number;
  loss: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  trainingTime: number;
  datasetSize: number;
  validationAccuracy?: number;
  testAccuracy?: number;
  epochs?: number;
  batchSize?: number;
  learningRate?: number;
}

export interface PerformanceMetrics {
  inferenceTime: number; // ms
  throughput: number; // samples/sec
  memoryUsage: number; // MB
  gpuUtilization?: number; // percentage
  cpuUtilization?: number; // percentage
}

// ============================================================================
// Contribution Types
// ============================================================================

export interface ModelContribution {
  id: string;
  modelId: string;
  contributorAddress: string;
  timestamp: Date;
  accuracyImprovement: number;
  gradientCID: string;
  status: ContributionStatus;
  validationScore?: number;
  metadata?: ContributionMetadata;
  reward?: number;
  transactionHash?: string;
}

export type ContributionStatus = 'pending' | 'validated' | 'rejected' | 'processing';

export interface ContributionMetadata {
  loss?: number;
  accuracy?: number;
  dataSize?: number;
  computeTime?: number;
  deviceInfo?: string;
  clientVersion?: string;
  [key: string]: any;
}

// ============================================================================
// Training Session Types
// ============================================================================

export interface TrainingSession {
  id: string;
  modelId: string;
  startedAt: Date;
  endedAt?: Date;
  status: TrainingStatus;
  participantCount: number;
  totalGradients: number;
  averageAccuracy: number;
  epochsCompleted: number;
  currentEpoch?: number;
  estimatedCompletion?: Date;
  configuration?: TrainingConfig;
}

export type TrainingStatus = 'active' | 'completed' | 'failed' | 'paused' | 'cancelled';

export interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: OptimizerType;
  validationSplit: number;
  earlyStopping?: boolean;
  patience?: number;
  minDelta?: number;
  scheduleType?: 'constant' | 'exponential' | 'step' | 'cosine';
}

export type OptimizerType = 'sgd' | 'adam' | 'rmsprop' | 'adamw' | 'adagrad';

export interface TrainingProgress {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss?: number;
  validationAccuracy?: number;
  timestamp: number;
  learningRate?: number;
  gradientNorm?: number;
}

// ============================================================================
// Model State Types (for training/inference)
// ============================================================================

export interface ModelState {
  weights: Float32Array;
  shape: number[];
  version: number;
  metadata?: ModelStateMetadata;
}

export interface ModelStateMetadata {
  accuracy?: number;
  loss?: number;
  epoch?: number;
  timestamp?: number;
  optimizer?: OptimizerType;
  hyperparameters?: Record<string, any>;
}

// ============================================================================
// Gradient Types (Federated Learning)
// ============================================================================

export interface GradientRef {
  contributor: string;
  cid: string;
  timestamp: number;
  validated: boolean;
  metadata?: Record<string, any>;
  validationScore?: number;
  weight?: number; // For weighted aggregation
}

export interface GradientData {
  values: Float32Array;
  shape: number[];
  contributorId: string;
  modelVersion: number;
  computedAt: number;
  signature?: string;
}

export interface AggregationResult {
  aggregatedGradient: Float32Array;
  participantCount: number;
  averageWeight: number;
  timestamp: number;
  convergenceMetric?: number;
}

// ============================================================================
// Model Info (Blockchain/API Types)
// ============================================================================

export interface ModelInfo {
  name: string;
  description: string;
  version: number;
  latestWeightsCid: string;
  owner: string;
  totalContributions?: number;
  lastUpdated?: number;
  createdAt?: number;
  architecture?: string;
  framework?: string;
  license?: string;
}

export interface BlockchainModelData {
  objectId: string;
  packageId: string;
  owner: string;
  version: number;
  weightsCid: string;
  gradients: GradientRef[];
  validators: string[];
  rewardPool: number;
  configuration: Record<string, any>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  cached?: boolean;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  requestId?: string;
  executionTime?: number;
  cacheHit?: boolean;
  version?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  timestamp: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// WebSocket Types (Real-time Updates)
// ============================================================================

export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: number;
  messageId?: string;
}

export type WSMessageType = 
  | 'model_update' 
  | 'contribution_added' 
  | 'training_progress' 
  | 'metrics_update'
  | 'validation_complete'
  | 'aggregation_started'
  | 'aggregation_complete'
  | 'error';

export interface ModelUpdateMessage {
  type: 'model_update';
  payload: {
    modelId: string;
    version: number;
    weightsCid: string;
    accuracy?: number;
  };
  timestamp: number;
}

export interface ContributionAddedMessage {
  type: 'contribution_added';
  payload: {
    contributionId: string;
    contributor: string;
    modelId: string;
    gradientCid: string;
  };
  timestamp: number;
}

export interface TrainingProgressMessage {
  type: 'training_progress';
  payload: TrainingProgress;
  timestamp: number;
}

// ============================================================================
// Model Comparison Types
// ============================================================================

export interface ModelComparison {
  model1: ModelVersion;
  model2: ModelVersion;
  accuracyDiff: number;
  sizeDiff: string;
  parametersDiff: string;
  improvements: string[];
  regressions?: string[];
  metrics: ComparisonMetrics;
}

export interface ComparisonMetrics {
  accuracyChange: number;
  lossChange: number;
  sizeChange: number;
  speedChange: number;
  contributorChange: number;
}

// ============================================================================
// Contributor Types
// ============================================================================

export interface ContributorStats {
  address: string;
  displayName?: string;
  totalContributions: number;
  totalImprovements: number;
  rank: number;
  lastContribution?: Date;
  averageImpact: number;
  totalRewards: number;
  validationSuccessRate: number;
  joinedAt?: Date;
  reputation?: number;
}

export interface ContributorProfile {
  address: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  stats: ContributorStats;
  badges: ContributorBadge[];
  contributions: ModelContribution[];
}

export interface ContributorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ============================================================================
// Training Statistics Types
// ============================================================================

export interface TrainingStatistics {
  totalTrainingHours: number;
  activeParticipants: number;
  completedSessions: number;
  dataProcessed: string;
  averageAccuracyGain: number;
  totalModels: number;
  totalGradients: number;
  averageValidationTime: number;
  networkUtilization: number;
}

export interface NetworkStatistics {
  totalNodes: number;
  activeNodes: number;
  totalStorage: string;
  usedStorage: string;
  averageLatency: number;
  throughput: number;
  uptime: number;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  score: number;
  confidence: number;
  issues?: ValidationIssue[];
  timestamp: number;
  validatorAddress: string;
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ModelError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

export type ModelErrorCode = 
  | 'MODEL_NOT_FOUND'
  | 'INVALID_GRADIENT'
  | 'VALIDATION_FAILED'
  | 'UPLOAD_FAILED'
  | 'DOWNLOAD_FAILED'
  | 'BLOCKCHAIN_ERROR'
  | 'STORAGE_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

// ============================================================================
// Filter and Sort Types
// ============================================================================

export interface ModelFilter {
  status?: ModelStatus[];
  minAccuracy?: number;
  maxAccuracy?: number;
  dateFrom?: Date;
  dateTo?: Date;
  contributors?: string[];
  searchQuery?: string;
}

export interface ModelSort {
  field: ModelSortField;
  order: 'asc' | 'desc';
}

export type ModelSortField = 
  | 'version' 
  | 'accuracy' 
  | 'createdAt' 
  | 'contributors' 
  | 'name'
  | 'size';

// ============================================================================
// Export all types
// ============================================================================

export type {
  // Re-export commonly used types at the top level
  ModelVersion as Model,
  ModelHistoryItem as History,
  ModelContribution as Contribution,
  TrainingSession as Session,
  ContributorStats as Contributor,
};

// ============================================================================
// Type Guards
// ============================================================================

export function isModelVersion(obj: any): obj is ModelVersion {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.walrusCID === 'string'
  );
}

export function isModelContribution(obj: any): obj is ModelContribution {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.contributorAddress === 'string' &&
    typeof obj.gradientCID === 'string'
  );
}

export function isValidModelStatus(status: string): status is ModelStatus {
  return ['active', 'archived', 'training', 'pending', 'failed'].includes(status);
}

export function isValidContributionStatus(status: string): status is ContributionStatus {
  return ['pending', 'validated', 'rejected', 'processing'].includes(status);
}