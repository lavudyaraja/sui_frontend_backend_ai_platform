/**
 * General-purpose utility helpers for the Sui-DAT project
 * Contains reusable formatting, parsing, retry, and type-checking utilities
 */

// Utility function to merge class names (commonly used with Tailwind CSS)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Reusable formatting helpers
export class FormatUtils {
  /**
   * Format bytes into human-readable units
   * @param bytes Number of bytes
   * @param decimals Number of decimal places
   * @returns Formatted string with units
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Format large numbers with commas
   * @param num Number to format
   * @returns Formatted string with commas
   */
  static formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Format timestamp to relative time
   * @param timestamp Unix timestamp in seconds
   * @returns Relative time string
   */
  static formatTimeAgo(timestamp: number): string {
    const now = Date.now() / 1000;
    const seconds = Math.floor(now - timestamp);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return '1 year ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return '1 month ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return '1 day ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return '1 hour ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return '1 minute ago';
    
    return 'just now';
  }

  /**
   * Format SUI address for display
   * @param address Full SUI address
   * @param start Number of characters to show at start
   * @param end Number of characters to show at end
   * @returns Shortened address
   */
  static formatAddress(address: string, start: number = 6, end: number = 4): string {
    if (!address || address.length <= start + end) {
      return address;
    }
    return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
  }
}

// Safe JSON parsing helpers
export class JsonUtils {
  /**
   * Safely parse JSON with fallback
   * @param str JSON string to parse
   * @param fallback Default value if parsing fails
   * @returns Parsed object or fallback
   */
  static safeParse<T>(str: string, fallback: T): T {
    try {
      return JSON.parse(str) as T;
    } catch (error) {
      return fallback;
    }
  }

  /**
   * Safely stringify JSON with fallback
   * @param obj Object to stringify
   * @param fallback Default string if stringifying fails
   * @returns JSON string or fallback
   */
  static safeStringify<T>(obj: T, fallback: string = '{}'): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      return fallback;
    }
  }
}

// Retry utility with exponential backoff
export class RetryUtils {
  /**
   * Execute a function with retry and exponential backoff
   * @param fn Function to execute
   * @param maxRetries Maximum number of retries
   * @param baseDelay Base delay in milliseconds
   * @param maxDelay Maximum delay in milliseconds
   * @returns Promise resolving to the result of fn
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    maxDelay: number = 10000
  ): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries) {
          throw error;
        }
        
        // Calculate exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, i) + Math.random() * 100,
          maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

// Timeout helper using AbortController
export class TimeoutUtils {
  /**
   * Create a timeout for fetch operations
   * @param timeoutMs Timeout in milliseconds
   * @returns AbortController and signal
   */
  static createTimeout(timeoutMs: number): { controller: AbortController; signal: AbortSignal } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Clean up timeout when aborted
    controller.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
    });
    
    return { controller, signal: controller.signal };
  }

  /**
   * Fetch with timeout
   * @param url URL to fetch
   * @param options Fetch options
   * @param timeoutMs Timeout in milliseconds
   * @returns Fetch response
   */
  static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 5000
  ): Promise<Response> {
    const { signal } = this.createTimeout(timeoutMs);
    
    return fetch(url, {
      ...options,
      signal: options.signal || signal
    });
  }
}

// Type-checking helpers
export class TypeUtils {
  /**
   * Check if value is a string
   * @param value Value to check
   * @returns True if value is a string
   */
  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * Check if value is an object
   * @param value Value to check
   * @returns True if value is an object
   */
  static isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Check if value is an array
   * @param value Value to check
   * @returns True if value is an array
   */
  static isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array, or empty object)
   * @param value Value to check
   * @returns True if value is empty
   */
  static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (this.isString(value)) return value.trim().length === 0;
    if (this.isArray(value)) return value.length === 0;
    if (this.isObject(value)) return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Check if value is a number
   * @param value Value to check
   * @returns True if value is a number
   */
  static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * Check if value is a boolean
   * @param value Value to check
   * @returns True if value is a boolean
   */
  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  /**
   * Check if value is a function
   * @param value Value to check
   * @returns True if value is a function
   */
  static isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }
}

// Deep clone and merge utilities
export class ObjectUtils {
  /**
   * Deep clone an object or array
   * @param obj Object to clone
   * @returns Deep cloned object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }

    return obj;
  }

  /**
   * Deep merge two objects
   * @param target Target object
   * @param source Source object
   * @returns Merged object
   */
  static deepMerge<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U {
    const output = { ...target, ...source } as T & U;

    if (TypeUtils.isObject(target) && TypeUtils.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (TypeUtils.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            Object.assign(output, { [key]: this.deepMerge(target[key], source[key]) });
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }
}

// Debug logging utilities
export class DebugUtils {
  /**
   * Log debug message only in development
   * @param namespace Namespace for the log
   * @param args Arguments to log
   */
  static debug(namespace: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${namespace}]`, ...args);
    }
  }

  /**
   * Log error message
   * @param namespace Namespace for the log
   * @param args Arguments to log
   */
  static error(namespace: string, ...args: any[]): void {
    console.error(`[${namespace}]`, ...args);
  }
}

// Error normalization helpers
export class ErrorUtils {
  /**
   * Normalize unknown error to readable string
   * @param error Unknown error
   * @returns Readable error message
   */
  static normalizeError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    
    return 'An unknown error occurred';
  }

  /**
   * Create error with stack trace
   * @param message Error message
   * @returns Error with stack trace
   */
  static createError(message: string): Error {
    const error = new Error(message);
    error.stack = new Error().stack;
    return error;
  }
}

// Query string utilities
export class QueryStringUtils {
  /**
   * Build query string from object
   * @param params Object with query parameters
   * @returns Formatted query string
   */
  static buildQueryString(params: Record<string, string | number | boolean>): string {
    const query = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    
    return query.toString();
  }

  /**
   * Parse query string to object
   * @param queryString Query string to parse
   * @returns Object with query parameters
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  }
}

// Unit conversion helpers
export class UnitUtils {
  /**
   * Convert tensor size to human-readable format
   * @param size Tensor size in parameters
   * @returns Formatted tensor size
   */
  static formatTensorSize(size: number): string {
    if (size >= 1e9) {
      return `${(size / 1e9).toFixed(1)}B`;
    }
    if (size >= 1e6) {
      return `${(size / 1e6).toFixed(1)}M`;
    }
    if (size >= 1e3) {
      return `${(size / 1e3).toFixed(1)}K`;
    }
    return size.toString();
  }

  /**
   * Convert gradient size to appropriate unit
   * @param size Gradient size in bytes
   * @returns Formatted gradient size
   */
  static formatGradientSize(size: number): string {
    return FormatUtils.formatBytes(size, 2);
  }

  /**
   * Convert learning rate to percentage
   * @param rate Learning rate
   * @returns Formatted percentage
   */
  static formatLearningRate(rate: number): string {
    return `${(rate * 100).toFixed(4)}%`;
  }
}