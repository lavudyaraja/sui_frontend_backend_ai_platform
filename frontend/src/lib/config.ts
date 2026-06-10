/**
 * Centralized configuration for backend and API endpoints
 * Handles environment-specific URLs for development and production
 */

/**
 * Get the backend base URL based on environment
 * Priority:
 * 1. NEXT_PUBLIC_BACKEND_URL (explicitly set)
 * 2. BACKEND_URL (fallback)
 * 3. Auto-detect based on environment (production vs development)
 */
export function getBackendUrl(): string {
  // Explicitly set backend URL (highest priority)
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, ''); // Remove trailing slashes
  }

  // Fallback to BACKEND_URL
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, '');
  }

  // Auto-detect based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';

  if (isProduction || isVercel) {
    // In production/Vercel, try to use Vercel environment variable or construct from deployment
    // If backend is deployed on Vercel, it will be available via VERCEL_URL
    // Otherwise, you need to set NEXT_PUBLIC_BACKEND_URL in Vercel dashboard
    const vercelBackendUrl = process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL;
    if (vercelBackendUrl) {
      return vercelBackendUrl.replace(/\/+$/, '');
    }

    // If no explicit backend URL is set in production, log warning but don't break
    // This allows the app to build, but API calls will fail with clear error messages
    if (!process.env.NEXT_PUBLIC_BACKEND_URL && !process.env.BACKEND_URL) {
      console.warn(
        '⚠️  NEXT_PUBLIC_BACKEND_URL is not set in production. ' +
        'Please set it in Vercel environment variables (Settings → Environment Variables). ' +
        'The application will not be able to connect to the backend without this setting.'
      );
    }
    
    // Return empty string to force error (better than using localhost)
    // The API routes will handle this and show a clear error message
    return '';
  }

  // Development fallback
  return 'http://localhost:8000';
}

/**
 * Backend API base URL
 */
export const BACKEND_URL = getBackendUrl();

/**
 * Check if backend URL is configured
 */
export function isBackendConfigured(): boolean {
  return BACKEND_URL !== '' && BACKEND_URL !== 'http://localhost:8000' || process.env.NODE_ENV === 'development';
}

/**
 * API endpoints configuration
 */
export const API_CONFIG = {
  BACKEND_BASE_URL: BACKEND_URL,
  BACKEND_API_PREFIX: '/api',
  
  // Full backend API URL
  get BACKEND_API_URL() {
    if (!this.BACKEND_BASE_URL) {
      // In production, provide a helpful error message
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
        console.error(
          '❌ Backend URL is not configured. ' +
          'Please set NEXT_PUBLIC_BACKEND_URL in Vercel environment variables. ' +
          'Go to: Settings → Environment Variables → Add NEXT_PUBLIC_BACKEND_URL'
        );
      }
      // Return a placeholder that will cause fetch to fail with a clear error
      return '';
    }
    return `${this.BACKEND_BASE_URL}${this.BACKEND_API_PREFIX}`;
  },
} as const;

