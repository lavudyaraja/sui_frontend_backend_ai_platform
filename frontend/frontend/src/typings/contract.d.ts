export interface ContractGradientSubmission {
  modelId: string;
  blobId: string;
  metadata: string;
}

export interface ContractModelUpdate {
  modelId: string;
  newVersion: string;
  blobId: string;
}

export interface ContractReputation {
  address: string;
  points: number;
  rank: number;
}

export interface ContractEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}