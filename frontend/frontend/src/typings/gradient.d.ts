export interface GradientData {
  weights: number[];
  biases: number[];
  metadata: {
    modelId: string;
    timestamp: Date;
    batchSize: number;
  };
}

export interface GradientSubmission {
  modelId: string;
  blobId: string;
  metadata: any;
}

export interface SerializedGradientData {
  weights: string; // base64 encoded
  biases: string;  // base64 encoded
  metadata: string; // JSON string
}