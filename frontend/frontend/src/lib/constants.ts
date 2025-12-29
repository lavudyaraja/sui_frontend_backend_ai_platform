/**
 * Global constants for the Sui-DAT project
 * Contains all static configuration values used across the application
 */

// App-level constants
export const APP = {
  NAME: 'Sui-DAT',
  VERSION: '1.0.0',
  DESCRIPTION: 'Decentralized AI Training Platform on Sui',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Network constants
export const NETWORK = {
  SUI_MAINNET: 'mainnet',
  SUI_TESTNET: 'testnet',
  SUI_DEVNET: 'devnet',
  DEFAULT_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
  RPC_URL: process.env.NEXT_PUBLIC_SUI_RPC_URL || '',
} as const;

// Contract configuration constants
export const CONTRACTS = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_SUI_DAT_PACKAGE_ID || '',
  MODEL_MODULE: 'model',
  CONTRIBUTOR_MODULE: 'contributor',
  GLOBAL_CONFIG_ID: process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID || '',
  MODEL_REGISTRY_ID: process.env.NEXT_PUBLIC_MODEL_REGISTRY_ID || '',
} as const;

// Training constants
export const TRAINING = {
  // Default training settings
  DEFAULT_EPOCHS: 10,
  DEFAULT_BATCH_SIZE: 32,
  DEFAULT_LEARNING_RATE: 0.001,
  MAX_EPOCHS: 100,
  MIN_BATCH_SIZE: 1,
  MAX_BATCH_SIZE: 1024,
  
  // Gradient parameters
  MAX_GRADIENT_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  GRADIENT_PRECISION: 'float32',
  
  // Model versioning rules
  VERSION_INCREMENT: 1,
  MIN_VERSION: 1,
  
  // Retention and cache durations
  TRAINING_SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  MODEL_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  GRADIENT_CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
} as const;

// Storage constants
export const STORAGE = {
  // Local storage keys
  STORAGE_KEYS: {
    WALLET_PROVIDER: 'sui-dat:wallet-provider',
    CONTRIBUTOR_STATS: 'sui-dat:contributor-stats',
    MODEL_CACHE: 'sui-dat:model-cache',
    TRAINING_STATE: 'sui-dat:training-state',
  },
  
  // Cache keys
  CACHE_KEYS: {
    LATEST_MODEL: 'latest-model',
    CONTRIBUTOR_LEADERBOARD: 'contributor-leaderboard',
    PENDING_GRADIENTS: 'pending-gradients',
  },
  
  // Cache durations
  CACHE_DURATION: {
    SHORT: 1 * 60 * 1000, // 1 minute
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
  },
} as const;

// Walrus constants
export const WALRUS = {
  BASE_URL: process.env.NEXT_PUBLIC_WALRUS_BASE_URL || 'https://walrus-testnet-beta.credible-squid-97.deno.dev',
  UPLOAD_ENDPOINT: '/v1/store',
  DOWNLOAD_ENDPOINT: '/v1/blobs',
  METADATA_ENDPOINT: '/v1/metadata',
  PIN_ENDPOINT: '/v1/pin',
  MAX_BLOB_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  DEFAULT_TIMEOUT: 30000, // 30 seconds
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_WALRUS_STORAGE: process.env.NEXT_PUBLIC_ENABLE_WALRUS_STORAGE === 'true',
  ENABLE_LOCAL_TRAINING: process.env.NEXT_PUBLIC_ENABLE_LOCAL_TRAINING === 'true',
  ENABLE_CONTRIBUTOR_REPUTATION: process.env.NEXT_PUBLIC_ENABLE_CONTRIBUTOR_REPUTATION === 'true',
  ENABLE_MODEL_VERSIONING: process.env.NEXT_PUBLIC_ENABLE_MODEL_VERSIONING === 'true',
  ENABLE_GRADIENT_AGGREGATION: process.env.NEXT_PUBLIC_ENABLE_GRADIENT_AGGREGATION === 'true',
} as const;

// Training status enumeration
export enum TrainingStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  TRAINING = 'training',
  STOPPING = 'stopping',
  COMPLETED = 'completed',
  ERROR = 'error',
}

// Contributor tier enumeration
export enum ContributorTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

// Model update type enumeration
export enum ModelUpdateType {
  GRADIENT_SUBMISSION = 'gradient_submission',
  FULL_MODEL_UPDATE = 'full_model_update',
  AGGREGATION_FINALIZATION = 'aggregation_finalization',
}

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  FETCH_MODEL: '/model',
  SUBMIT_GRADIENT: '/gradient',
  FETCH_CONTRIBUTORS: '/contributors',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'No wallet connected. Please connect your wallet to continue.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to perform this action.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INVALID_INPUT: 'Invalid input provided.',
  MODEL_NOT_FOUND: 'Model not found.',
  GRADIENT_TOO_LARGE: 'Gradient size exceeds maximum allowed size.',
} as const;

// UI constants
export const UI = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  
  // Toast notifications
  TOAST_DURATION: 5000, // 5 seconds
  
  // Animation durations
  ANIMATION_DURATION: 300, // milliseconds
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;