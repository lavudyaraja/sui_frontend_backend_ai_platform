// Debug logger
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[GradientParser]', ...args);
  }
};

// Type definitions
export interface GradientSummary {
  /** Total size of gradients */
  size: number;
  /** Mean value of gradients */
  mean: number;
  /** Standard deviation of gradients */
  std: number;
  /** Minimum value of gradients */
  min: number;
  /** Maximum value of gradients */
  max: number;
  /** Preview of first 20 gradient values */
  preview: number[];
}

/**
 * Convert Float32Array gradients to Uint8Array for Walrus upload
 * @param grad Float32Array gradients
 * @returns Uint8Array representation of gradients
 */
export function gradientsToUint8(grad: Float32Array): Uint8Array {
  debugLog(`Converting ${grad.length} gradients to Uint8Array`);
  
  try {
    // Create a new ArrayBuffer with the same byte length
    const buffer = new ArrayBuffer(grad.byteLength);
    
    // Create a Float32Array view of the buffer
    const floatView = new Float32Array(buffer);
    
    // Copy the gradient values
    floatView.set(grad);
    
    // Return as Uint8Array
    const uint8View = new Uint8Array(buffer);
    
    debugLog(`Conversion completed, resulting in ${uint8View.length} bytes`);
    return uint8View;
  } catch (error) {
    debugLog('Gradient conversion failed:', error);
    throw new Error(`Failed to convert gradients: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compute statistics for Float32Array gradients
 * @param grad Float32Array gradients
 * @returns Object with mean, std, min, max statistics
 */
export function getStats(grad: Float32Array): { mean: number; std: number; min: number; max: number } {
  debugLog(`Computing statistics for ${grad.length} gradients`);
  
  if (grad.length === 0) {
    return { mean: 0, std: 0, min: 0, max: 0 };
  }
  
  // Convert to array for easier manipulation
  const gradArray = Array.from(grad);
  
  // Calculate mean
  const sum = gradArray.reduce((acc, val) => acc + val, 0);
  const mean = sum / gradArray.length;
  
  // Calculate standard deviation
  const squaredDiffs = gradArray.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / gradArray.length;
  const std = Math.sqrt(avgSquaredDiff);
  
  // Find min and max
  const min = Math.min(...gradArray);
  const max = Math.max(...gradArray);
  
  debugLog(`Statistics computed - Mean: ${mean}, Std: ${std}, Min: ${min}, Max: ${max}`);
  
  return { mean, std, min, max };
}

/**
 * Generate a JSON summary of gradients for UI display
 * @param grad Float32Array gradients
 * @returns GradientSummary object
 */
export function gradientsToJSONSummary(grad: Float32Array): GradientSummary {
  debugLog(`Generating JSON summary for ${grad.length} gradients`);
  
  try {
    // Get statistics
    const stats = getStats(grad);
    
    // Get preview of first 20 values (or fewer if array is smaller)
    const previewLength = Math.min(20, grad.length);
    const preview = Array.from(grad.slice(0, previewLength));
    
    const summary: GradientSummary = {
      size: grad.length,
      mean: parseFloat(stats.mean.toFixed(6)),
      std: parseFloat(stats.std.toFixed(6)),
      min: parseFloat(stats.min.toFixed(6)),
      max: parseFloat(stats.max.toFixed(6)),
      preview: preview.map(val => parseFloat(val.toFixed(6)))
    };
    
    debugLog('JSON summary generated successfully');
    return summary;
  } catch (error) {
    debugLog('Gradient summary generation failed:', error);
    throw new Error(`Failed to generate gradient summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}