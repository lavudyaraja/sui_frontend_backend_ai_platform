'use client';

import { API_ENDPOINTS } from '@/lib/constants';

// Custom error class for backend API errors
export class BackendAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'BackendAPIError';
  }
}

// Helper function to make API requests to the backend
async function backendApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_ENDPOINTS.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new BackendAPIError(`Backend API request failed: ${response.status} ${response.statusText}`, response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(`Backend API request to ${url} failed:`, error);
    
    if (error instanceof BackendAPIError) {
      throw error;
    }
    
    throw new BackendAPIError(
      `Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

// Training Service
export interface TrainingRequest {
  model_id: string;
  params?: Record<string, any>;
}

export interface TrainingStatus {
  session_id: string;
  model_id: string;
  status: string;
  started_at: string;
  updated_at: string;
  params?: Record<string, any>;
}

export interface TrainingResult {
  session_id: string;
  model_id: string;
  status: string;
  final_accuracy?: number;
  final_loss?: number;
  completed_at: string;
}

export async function startTraining(request: TrainingRequest): Promise<{ session_id: string }> {
  return backendApiRequest<{ session_id: string }>('/training/start', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getTrainingStatus(sessionId: string): Promise<TrainingStatus> {
  return backendApiRequest<TrainingStatus>(`/training/status/${sessionId}`);
}

export async function stopTraining(sessionId: string): Promise<{ status: string }> {
  return backendApiRequest<{ status: string }>(`/training/stop/${sessionId}`, {
    method: 'POST',
  });
}

// Model Service
export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  current_version: string;
  created_at: string;
  updated_at: string;
  accuracy?: number;
}

export interface ModelVersion {
  model_id: string;
  version: string;
  created_at: string;
  accuracy?: number;
  weights_uri: string;
  contributors: number;
}

export async function getModelInfo(modelId: string): Promise<ModelInfo> {
  return backendApiRequest<ModelInfo>(`/models/${modelId}`);
}

export async function getModelVersions(modelId: string): Promise<ModelVersion[]> {
  return backendApiRequest<ModelVersion[]>(`/models/${modelId}/versions`);
}

export async function getModelVersion(modelId: string, versionId: string): Promise<ModelVersion> {
  return backendApiRequest<ModelVersion>(`/models/${modelId}/versions/${versionId}`);
}

// Gradient Service
export interface GradientUploadRequest {
  model_id: string;
  contributor_id: string;
  gradient_data: string; // base64 encoded
}

export interface GradientInfo {
  uri: string;
  model_id: string;
  contributor_id: string;
  timestamp: string;
  size: number;
}

export async function uploadGradient(formData: FormData): Promise<{ uri: string }> {
  // For FormData, we don't want to set Content-Type header as browser will set it with boundary
  return backendApiRequest<{ uri: string }>('/gradients/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function downloadGradient(gradientUri: string): Promise<ArrayBuffer> {
  const url = `${API_ENDPOINTS.BASE_URL}/gradients/download/${gradientUri}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new BackendAPIError(`Failed to download gradient: ${response.status} ${response.statusText}`, response.status);
    }
    
    return await response.arrayBuffer();
  } catch (error) {
    if (error instanceof BackendAPIError) {
      throw error;
    }
    
    throw new BackendAPIError(
      `Failed to download gradient: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

export async function listGradients(modelId: string): Promise<{ gradients: string[] }> {
  return backendApiRequest<{ gradients: string[] }>(`/gradients/list/${modelId}`);
}

// Contributor Service
export interface Contributor {
  id: string;
  address: string;
  reputation: number;
  contributions: number;
  joined_at: string;
  last_active?: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  reputation: number;
  contributions: number;
}

export async function getContributor(contributorId: string): Promise<Contributor> {
  return backendApiRequest<Contributor>(`/contributors/${contributorId}`);
}

export async function getContributorStats(contributorId: string): Promise<any> {
  return backendApiRequest<any>(`/contributors/${contributorId}/stats`);
}

export async function getLeaderboard(limit: number = 10): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return backendApiRequest<{ leaderboard: LeaderboardEntry[] }>(`/contributors/leaderboard?limit=${limit}`);
}

// Health check
export async function checkBackendHealth(): Promise<{ status: string; service: string; timestamp: string }> {
  return backendApiRequest<{ status: string; service: string; timestamp: string }>('/health');
}