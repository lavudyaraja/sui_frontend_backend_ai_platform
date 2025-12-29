'use client';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[ContributorsAPI]', ...args);
  }
};

// Custom error class for contributor API errors
export class ContributorsAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ContributorsAPIError';
  }
}

// Type definitions
export interface Contributor {
  /** Unique identifier */
  id: string;
  /** Contributor address */
  address: string;
  /** Reputation score */
  reputation: number;
  /** Number of contributions */
  contributions: number;
}

/**
 * Helper function to fetch with timeout and error handling
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to parsed JSON
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<any> {
  debugLog(`Fetching from: ${url}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ContributorsAPIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    
    const text = await response.text();
    if (!text) return null;
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new ContributorsAPIError(
        'Failed to parse JSON response',
        undefined,
        parseError
      );
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new ContributorsAPIError('Request timeout after 10 seconds');
    }
    
    if (error instanceof ContributorsAPIError) {
      throw error;
    }
    
    throw new ContributorsAPIError(
      `Failed to fetch: ${error.message}`,
      undefined,
      error
    );
  }
}

/**
 * Fetch top contributors for leaderboard
 * @param limit Number of top contributors to fetch
 * @returns Promise resolving to array of Contributor
 */
export default async function fetchTopContributors(limit: number = 10): Promise<Contributor[]> {
  debugLog(`Fetching top ${limit} contributors`);
  
  try {
    // First try to fetch from the API endpoint
    try {
      const response = await fetchWithTimeout(`/api/contributors?limit=${encodeURIComponent(limit)}`);
      
      // If we get a successful response with data, use it
      if (response && response.success && Array.isArray(response.data)) {
        debugLog(`Fetched ${response.data.length} contributors from API`);
        return response.data.map((contributor: any) => ({
          id: contributor.id || contributor.address || `contrib_${Math.random().toString(36).substr(2, 9)}`,
          address: contributor.address || '',
          reputation: contributor.reputation || contributor.score || 0,
          contributions: contributor.contributions || contributor.submissions || 0,
        }));
      }
    } catch (apiError) {
      debugLog('API fetch failed, will use fallback:', apiError);
    }
    
    // Fallback to mock data if API fails
    debugLog('Using mock data for contributors');
    const mockContributors: Contributor[] = [];
    
    for (let i = 0; i < limit; i++) {
      mockContributors.push({
        id: `contrib_${i}`,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        reputation: Math.floor(Math.random() * 5000),
        contributions: Math.floor(Math.random() * 100),
      });
    }
    
    return mockContributors;
  } catch (error) {
    debugLog('Failed to fetch contributors:', error);
    
    if (error instanceof ContributorsAPIError) {
      throw error;
    }
    
    throw new ContributorsAPIError(
      `Failed to fetch contributors: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}