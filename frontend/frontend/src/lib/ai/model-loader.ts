// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[ModelLoader]', ...args);
  }
};

// Type definitions
export interface ModelState {
  weights: Float32Array;
  shape: number[];
  version: number;
  metadata?: {
    accuracy?: number;
    loss?: number;
    epoch?: number;
    timestamp?: number;
  };
}

export interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: 'sgd' | 'adam' | 'rmsprop';
  validationSplit: number;
}

export interface TrainingProgress {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss?: number;
  validationAccuracy?: number;
  timestamp: number;
}

// Walrus storage configuration
const WALRUS_API_ENDPOINT = process.env.NEXT_PUBLIC_WALRUS_API_ENDPOINT || 'https://walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space';

/**
 * Load model from Walrus storage
 */
export async function loadInitialModel(weightsCid: string): Promise<ModelState> {
  debugLog(`Loading model from Walrus with CID: ${weightsCid}`);
  
  try {
    // Construct Walrus blob URL
    const blobUrl = `${WALRUS_AGGREGATOR}/v1/${weightsCid}`;
    
    debugLog(`Fetching from: ${blobUrl}`);
    
    // Fetch blob data
    const response = await fetch(blobUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`);
    }

    // Get array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse model data (assuming Float32Array format)
    const weights = new Float32Array(arrayBuffer);
    
    debugLog(`Model loaded: ${weights.length} parameters`);
    
    return {
      weights,
      shape: [weights.length],
      version: 1,
      metadata: {
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    debugLog('Failed to load model from Walrus:', error);
    
    // Fallback: Create empty model
    debugLog('Falling back to empty model');
    return createEmptyModel();
  }
}

/**
 * Upload model weights to Walrus
 */
export async function uploadModelToWalrus(weights: Float32Array): Promise<string> {
  debugLog(`Uploading model to Walrus: ${weights.length} parameters`);
  
  try {
    // Convert to blob - fix for SharedArrayBuffer compatibility
    const buffer = weights.buffer instanceof SharedArrayBuffer 
      ? new Uint8Array(weights.buffer).slice().buffer 
      : weights.buffer;
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    
    // Upload to Walrus
    const formData = new FormData();
    formData.append('file', blob, 'model_weights.bin');
    
    const response = await fetch(`${WALRUS_API_ENDPOINT}/v1/store`, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const cid = result.newlyCreated?.blobObject?.blobId || result.alreadyCertified?.blobId;
    
    if (!cid) {
      throw new Error('No CID returned from Walrus');
    }

    debugLog(`Model uploaded successfully: ${cid}`);
    return cid;
  } catch (error) {
    debugLog('Failed to upload to Walrus:', error);
    throw new Error(`Model upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create an empty model with Xavier initialization
 */
export function createEmptyModel(size: number = 256): ModelState {
  debugLog(`Creating empty model with ${size} parameters`);
  
  const weights = new Float32Array(size);
  const scale = Math.sqrt(2.0 / size); // Xavier initialization
  
  for (let i = 0; i < size; i++) {
    weights[i] = (Math.random() * 2 - 1) * scale;
  }
  
  return {
    weights,
    shape: [size],
    version: 0,
    metadata: {
      accuracy: 0,
      loss: 0,
      epoch: 0,
      timestamp: Date.now(),
    },
  };
}

/**
 * Update model with gradients using specified optimizer
 */
export function updateModel(
  model: ModelState,
  gradients: Float32Array,
  config: Partial<TrainingConfig> = {}
): ModelState {
  const lr = config.learningRate || 0.01;
  const optimizer = config.optimizer || 'sgd';
  
  debugLog(`Updating model with ${optimizer} optimizer, lr: ${lr}`);
  
  if (model.weights.length !== gradients.length) {
    throw new Error(
      `Weight/gradient size mismatch: ${model.weights.length} vs ${gradients.length}`
    );
  }

  const newWeights = new Float32Array(model.weights.length);
  
  // Apply optimizer
  switch (optimizer) {
    case 'adam':
      // Simplified Adam update
      for (let i = 0; i < model.weights.length; i++) {
        const m = 0.9 * 0 + 0.1 * gradients[i]; // Momentum
        const v = 0.999 * 0 + 0.001 * gradients[i] * gradients[i]; // Velocity
        newWeights[i] = model.weights[i] - lr * m / (Math.sqrt(v) + 1e-8);
      }
      break;
      
    case 'rmsprop':
      // RMSprop update
      for (let i = 0; i < model.weights.length; i++) {
        const cache = 0.9 * 0 + 0.1 * gradients[i] * gradients[i];
        newWeights[i] = model.weights[i] - lr * gradients[i] / (Math.sqrt(cache) + 1e-8);
      }
      break;
      
    case 'sgd':
    default:
      // Standard gradient descent
      for (let i = 0; i < model.weights.length; i++) {
        newWeights[i] = model.weights[i] - lr * gradients[i];
      }
      break;
  }
  
  return {
    weights: newWeights,
    shape: [...model.shape],
    version: model.version + 1,
    metadata: {
      ...model.metadata,
      timestamp: Date.now(),
    },
  };
}

/**
 * Aggregate multiple gradients (federated learning)
 */
export function aggregateGradients(
  gradients: Float32Array[],
  weights?: number[]
): Float32Array {
  debugLog(`Aggregating ${gradients.length} gradients`);
  
  if (gradients.length === 0) {
    throw new Error('No gradients to aggregate');
  }

  const size = gradients[0].length;
  const aggregated = new Float32Array(size);
  
  // Use equal weights if not provided
  const normalizedWeights = weights 
    ? weights.map(w => w / weights.reduce((a, b) => a + b, 0))
    : gradients.map(() => 1 / gradients.length);

  // Weighted average
  for (let i = 0; i < size; i++) {
    let sum = 0;
    for (let j = 0; j < gradients.length; j++) {
      if (gradients[j].length !== size) {
        throw new Error(`Gradient ${j} has incompatible size`);
      }
      sum += gradients[j][i] * normalizedWeights[j];
    }
    aggregated[i] = sum;
  }

  debugLog('Gradients aggregated successfully');
  return aggregated;
}

/**
 * Compute gradient from loss
 * Simplified gradient computation for demonstration
 */
export function computeGradient(
  model: ModelState,
  inputs: Float32Array,
  labels: Float32Array
): Float32Array {
  debugLog('Computing gradient');
  
  const gradient = new Float32Array(model.weights.length);
  const predictions = forward(model, inputs);
  
  // Compute loss gradient (MSE)
  const diff = new Float32Array(predictions.length);
  for (let i = 0; i < predictions.length; i++) {
    diff[i] = predictions[i] - labels[i];
  }

  // Backpropagate (simplified)
  for (let i = 0; i < gradient.length; i++) {
    gradient[i] = diff[Math.min(i, diff.length - 1)] / inputs.length;
  }

  return gradient;
}

/**
 * Forward pass through model
 * Simplified forward pass for demonstration
 */
function forward(model: ModelState, inputs: Float32Array): Float32Array {
  const outputs = new Float32Array(Math.min(inputs.length, 10));
  
  for (let i = 0; i < outputs.length; i++) {
    let sum = 0;
    for (let j = 0; j < Math.min(inputs.length, model.weights.length); j++) {
      sum += inputs[j] * model.weights[j % model.weights.length];
    }
    outputs[i] = 1 / (1 + Math.exp(-sum)); // Sigmoid activation
  }
  
  return outputs;
}

/**
 * Evaluate model performance
 */
export function evaluateModel(
  model: ModelState,
  testInputs: Float32Array[],
  testLabels: Float32Array[]
): { accuracy: number; loss: number } {
  debugLog('Evaluating model');
  
  let totalLoss = 0;
  let correct = 0;

  for (let i = 0; i < testInputs.length; i++) {
    const predictions = forward(model, testInputs[i]);
    const labels = testLabels[i];
    
    // Compute loss (MSE)
    let sampleLoss = 0;
    for (let j = 0; j < Math.min(predictions.length, labels.length); j++) {
      const diff = predictions[j] - labels[j];
      sampleLoss += diff * diff;
    }
    totalLoss += sampleLoss / predictions.length;
    
    // Check accuracy (simplified: correct if first prediction is close)
    if (Math.abs(predictions[0] - labels[0]) < 0.1) {
      correct++;
    }
  }

  return {
    loss: totalLoss / testInputs.length,
    accuracy: (correct / testInputs.length) * 100,
  };
}

/**
 * Training callback type
 */
export type ProgressCallback = (progress: TrainingProgress) => void;

/**
 * Train model with given data
 */
export async function trainModel(
  model: ModelState,
  trainInputs: Float32Array[],
  trainLabels: Float32Array[],
  config: TrainingConfig,
  onProgress?: ProgressCallback
): Promise<ModelState> {
  debugLog('Starting model training', config);
  
  let currentModel = model;
  
  for (let epoch = 0; epoch < config.epochs; epoch++) {
    let epochLoss = 0;
    let epochAccuracy = 0;

    // Training loop
    for (let i = 0; i < trainInputs.length; i += config.batchSize) {
      const batchInputs = trainInputs.slice(i, i + config.batchSize);
      const batchLabels = trainLabels.slice(i, i + config.batchSize);
      
      // Compute gradients for batch
      const batchGradients: Float32Array[] = [];
      for (let j = 0; j < batchInputs.length; j++) {
        const grad = computeGradient(currentModel, batchInputs[j], batchLabels[j]);
        batchGradients.push(grad);
      }
      
      // Aggregate and apply
      const aggregated = aggregateGradients(batchGradients);
      currentModel = updateModel(currentModel, aggregated, config);
    }

    // Evaluate
    const metrics = evaluateModel(currentModel, trainInputs, trainLabels);
    epochLoss = metrics.loss;
    epochAccuracy = metrics.accuracy;

    // Update metadata
    currentModel.metadata = {
      ...currentModel.metadata,
      accuracy: epochAccuracy,
      loss: epochLoss,
      epoch: epoch + 1,
      timestamp: Date.now(),
    };

    // Report progress
    if (onProgress) {
      onProgress({
        epoch: epoch + 1,
        loss: epochLoss,
        accuracy: epochAccuracy,
        timestamp: Date.now(),
      });
    }

    debugLog(`Epoch ${epoch + 1}/${config.epochs}: Loss=${epochLoss.toFixed(4)}, Accuracy=${epochAccuracy.toFixed(2)}%`);
  }

  debugLog('Training complete');
  return currentModel;
}