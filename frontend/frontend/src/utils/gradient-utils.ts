export function validateGradientData(data: any): boolean {
  // Check if data has required fields
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check weights array
  if (!Array.isArray(data.weights)) {
    return false;
  }

  // Check biases array
  if (!Array.isArray(data.biases)) {
    return false;
  }

  // Check metadata
  if (!data.metadata || typeof data.metadata !== 'object') {
    return false;
  }

  // Check required metadata fields
  if (typeof data.metadata.modelId !== 'string') {
    return false;
  }

  if (!(data.metadata.timestamp instanceof Date) && typeof data.metadata.timestamp !== 'string') {
    return false;
  }

  if (typeof data.metadata.batchSize !== 'number') {
    return false;
  }

  return true;
}

export function calculateGradientStats(gradients: { weights: number[]; biases: number[] }): {
  weightMean: number;
  weightStd: number;
  biasMean: number;
  biasStd: number;
} {
  // Calculate mean and standard deviation for weights
  const weightSum = gradients.weights.reduce((sum, w) => sum + w, 0);
  const weightMean = weightSum / gradients.weights.length;
  
  const weightVariance = gradients.weights.reduce((sum, w) => sum + Math.pow(w - weightMean, 2), 0) / gradients.weights.length;
  const weightStd = Math.sqrt(weightVariance);

  // Calculate mean and standard deviation for biases
  const biasSum = gradients.biases.reduce((sum, b) => sum + b, 0);
  const biasMean = biasSum / gradients.biases.length;
  
  const biasVariance = gradients.biases.reduce((sum, b) => sum + Math.pow(b - biasMean, 2), 0) / gradients.biases.length;
  const biasStd = Math.sqrt(biasVariance);

  return {
    weightMean,
    weightStd,
    biasMean,
    biasStd,
  };
}