export interface UserProfile {
  address: string;
  shortAddress: string;
  reputation: number;
  contributions: number;
  joinedAt: Date;
  lastActive: Date;
}

export interface UserContribution {
  id: string;
  modelId: string;
  modelName: string;
  accuracyImprovement: number;
  timestamp: Date;
}

export interface UserStats {
  totalContributions: number;
  totalReputation: number;
  rank: number;
  modelsTrained: number;
}