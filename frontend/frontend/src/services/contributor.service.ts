import { modelService, ModelServiceError } from './model.service';

// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[ContributorService]', ...args);
  }
};

// Custom error class
export class ContributorError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'ContributorError';
  }
}

// Type definitions
export interface ContributorEntry {
  /** Contributor rank */
  rank: number;
  /** Contributor address */
  address: string;
  /** Reputation score */
  reputation: number;
  /** Number of submissions */
  submissions: number;
  /** Contributor tier */
  tier: 'Basic' | 'Power' | 'Elite';
}

export interface ContributorStats {
  /** Contributor address */
  address: string;
  /** Reputation score */
  reputation: number;
  /** Number of submissions */
  submissions: number;
  /** Last active timestamp */
  lastActive: number;
  /** Contributor tiers */
  tiers: string[];
}

export interface SubscriptionHandle {
  /** Close the subscription */
  close(): void;
}

export type SignerLike = any;

// Cache constants
const LEADERBOARD_CACHE_KEY = 'sui_dat_leaderboard';
const LEADERBOARD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Contributor service class
export class ContributorService {
  private subscriptions: Map<string, SubscriptionHandle> = new Map();

  /**
   * Get the contributor leaderboard
   * @param limit Number of contributors to fetch (default: 10)
   * @returns Promise resolving to array of ContributorEntry
   */
  async getLeaderboard(limit: number = 10): Promise<ContributorEntry[]> {
    debugLog(`Fetching leaderboard with limit: ${limit}`);
    
    try {
      // Try to get from cache first
      const cached = this.getLeaderboardFromCache(limit);
      if (cached && cached.length > 0) {
        debugLog('Returning leaderboard from cache');
        return cached;
      }
      
      // Fetch from API
      const contributors = await this.fetchLeaderboardFromAPI(limit);
      
      // Cache the results
      this.cacheLeaderboard(contributors);
      
      return contributors;
    } catch (error) {
      debugLog('Failed to fetch leaderboard, returning mock data:', error);
      
      // Fallback to mock data
      return this.generateMockLeaderboard(limit);
    }
  }

  /**
   * Get contributor statistics
   * @param address Contributor address
   * @returns Promise resolving to ContributorStats
   */
  async getContributorStats(address: string): Promise<ContributorStats> {
    debugLog(`Fetching stats for contributor: ${address}`);
    
    try {
      // Try to fetch from API
      const response = await fetch(`/api/contributors/${address}`);
      
      if (!response.ok) {
        throw new ContributorError(`Failed to fetch contributor stats: ${response.status}`);
      }
      
      const stats = await response.json();
      return stats;
    } catch (error) {
      debugLog('Failed to fetch contributor stats, building from leaderboard:', error);
      
      // Fallback: Build from leaderboard
      const leaderboard = await this.getLeaderboard(100);
      const contributor = leaderboard.find(c => c.address === address);
      
      if (contributor) {
        return {
          address: contributor.address,
          reputation: contributor.reputation,
          submissions: contributor.submissions,
          lastActive: Date.now(),
          tiers: [contributor.tier],
        };
      }
      
      // If not found in leaderboard, return mock data
      return {
        address,
        reputation: Math.floor(Math.random() * 2000),
        submissions: Math.floor(Math.random() * 50),
        lastActive: Date.now(),
        tiers: ['Basic'],
      };
    }
  }

  /**
   * Award reputation points to a contributor
   * @param modelId Model ID
   * @param contributor Contributor address
   * @param points Reputation points to award
   * @param signer Signer for transaction
   * @returns Promise resolving to transaction digest
   */
  async awardReputation(
    modelId: string,
    contributor: string,
    points: number,
    signer: SignerLike
  ): Promise<string> {
    debugLog(`Awarding ${points} reputation points to ${contributor} for model ${modelId}`);
    
    try {
      // Try on-chain Move call first
      if (signer) {
        try {
          const txDigest = await modelService.validateGradient(modelId, 0, points, signer);
          debugLog('Reputation awarded on-chain:', txDigest);
          return txDigest;
        } catch (error) {
          if (error instanceof ModelServiceError) {
            debugLog('On-chain reputation award failed, falling back to API:', error.message);
          } else {
            throw error;
          }
        }
      }
      
      // Fallback to API call
      const response = await fetch('/api/reputation/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          contributor,
          points,
        }),
      });
      
      if (!response.ok) {
        throw new ContributorError(`Failed to award reputation via API: ${response.status}`);
      }
      
      const result = await response.json();
      debugLog('Reputation awarded via API:', result);
      return result.transactionDigest || 'api_success';
    } catch (error) {
      throw new ContributorError(
        `Failed to award reputation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Subscribe to leaderboard updates
   * @param onUpdate Callback function to receive updates
   * @returns Subscription handle
   */
  subscribeLeaderboard(onUpdate: (list: ContributorEntry[]) => void): SubscriptionHandle {
    debugLog('Subscribing to leaderboard updates');
    
    // Create a unique subscription ID
    const subscriptionId = `leaderboard_${Date.now()}`;
    
    // Try to use EventSource (SSE)
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let retryDelay = 1000; // Start with 1 second
    
    const connect = () => {
      try {
        eventSource = new EventSource('/api/contributors/stream');
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onUpdate(data);
            // Reset retry delay on successful message
            retryDelay = 1000;
          } catch (error) {
            debugLog('Failed to parse leaderboard update:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          debugLog('EventSource error, attempting reconnect:', error);
          eventSource?.close();
          
          // Exponential backoff reconnect
          reconnectTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 30000); // Max 30 seconds
            connect();
          }, retryDelay);
        };
      } catch (error) {
        debugLog('Failed to create EventSource, falling back to polling:', error);
        
        // Fallback to polling if EventSource fails
        const poll = async () => {
          try {
            const leaderboard = await this.getLeaderboard(20);
            onUpdate(leaderboard);
          } catch (error) {
            debugLog('Polling failed:', error);
          }
          
          // Schedule next poll
          reconnectTimeout = setTimeout(poll, 10000); // Poll every 10 seconds
        };
        
        // Start polling
        poll();
      }
    };
    
    // Start connection
    connect();
    
    // Create subscription handle
    const handle: SubscriptionHandle = {
      close: () => {
        debugLog('Closing leaderboard subscription');
        eventSource?.close();
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
        }
        this.subscriptions.delete(subscriptionId);
      },
    };
    
    // Store subscription
    this.subscriptions.set(subscriptionId, handle);
    
    return handle;
  }

  /**
   * Get leaderboard from cache
   * @param limit Number of contributors to fetch
   * @returns Cached contributors or null if not available/stale
   */
  private getLeaderboardFromCache(limit: number): ContributorEntry[] | null {
    try {
      const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      // Check if cache is stale
      if (Date.now() - timestamp > LEADERBOARD_CACHE_TTL) {
        return null;
      }
      
      return data.slice(0, limit);
    } catch (error) {
      debugLog('Failed to read leaderboard from cache:', error);
      return null;
    }
  }

  /**
   * Cache leaderboard data
   * @param contributors Contributor entries to cache
   */
  private cacheLeaderboard(contributors: ContributorEntry[]): void {
    try {
      const cacheData = {
        data: contributors,
        timestamp: Date.now(),
      };
      localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      debugLog('Failed to cache leaderboard:', error);
    }
  }

  /**
   * Fetch leaderboard from API
   * @param limit Number of contributors to fetch
   * @returns Promise resolving to array of ContributorEntry
   */
  private async fetchLeaderboardFromAPI(limit: number): Promise<ContributorEntry[]> {
    const response = await fetch(`/api/contributors?limit=${limit}`);
    
    if (!response.ok) {
      throw new ContributorError(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return this.normalizeLeaderboard(data);
  }

  /**
   * Normalize leaderboard data
   * @param data Raw contributor data
   * @returns Normalized ContributorEntry array
   */
  private normalizeLeaderboard(data: any[]): ContributorEntry[] {
    return data.map((contributor, index) => ({
      rank: index + 1,
      address: contributor.address || '',
      reputation: contributor.reputation || 0,
      submissions: contributor.submissions || 0,
      tier: contributor.tier || 'Basic',
    }));
  }

  /**
   * Generate mock leaderboard for development
   * @param limit Number of contributors to generate
   * @returns Mock ContributorEntry array
   */
  private generateMockLeaderboard(limit: number): ContributorEntry[] {
    const tiers: ('Basic' | 'Power' | 'Elite')[] = ['Basic', 'Power', 'Elite'];
    const contributors: ContributorEntry[] = [];
    
    for (let i = 0; i < limit; i++) {
      contributors.push({
        rank: i + 1,
        address: `0x${Math.random().toString(16).substr(2, 64)}`,
        reputation: Math.floor(Math.random() * 5000),
        submissions: Math.floor(Math.random() * 100),
        tier: tiers[Math.floor(Math.random() * tiers.length)],
      });
    }
    
    return contributors;
  }
}

// Export singleton instance
export const contributorService = new ContributorService();

// Example usage:
// const leaderboard = await contributorService.getLeaderboard(10);
// const stats = await contributorService.getContributorStats("0x1234...");
// const handle = contributorService.subscribeLeaderboard((list) => console.log(list));
// handle.close(); // To unsubscribe