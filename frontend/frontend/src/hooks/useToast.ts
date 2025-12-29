/**
 * Unified toast/notification system for the Sui-DAT project
 * Provides a simple API for displaying various types of toast messages
 */

'use client';

import { useState, useEffect } from 'react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast position
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

// Toast configuration
export interface ToastConfig {
  id?: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
}

// Toast state
export interface Toast extends ToastConfig {
  id: string;
}

// Toast context
interface ToastContext {
  toasts: Toast[];
  addToast: (config: ToastConfig) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Toast hook return type
interface UseToastReturn {
  toasts: Toast[];
  toast: {
    success: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => void;
    error: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => void;
    warning: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => void;
    info: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => void;
  };
  dismiss: (id: string) => void;
  clear: () => void;
}

// Default configuration
const DEFAULT_DURATION = 5000; // 5 seconds
const DEFAULT_POSITION: ToastPosition = 'bottom-right';

// Toast manager
class ToastManager {
  private static instance: ToastManager;
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  private constructor() {}

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  addToast(config: ToastConfig): string {
    const id = config.id || Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      ...config,
      id,
      duration: config.duration ?? DEFAULT_DURATION,
      position: config.position ?? DEFAULT_POSITION,
    };

    this.toasts = [...this.toasts, toast];
    this.notifyListeners();

    // Auto dismiss after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, toast.duration);
    }

    return id;
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  clearToasts() {
    this.toasts = [];
    this.notifyListeners();
  }
}

// Error normalization helper
const normalizeError = (error: unknown): string => {
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
};

// Debug logging utility
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[useToast]', ...args);
  }
};

/**
 * React hook for displaying toast notifications
 * @returns Toast functions and state
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastManager = ToastManager.getInstance();

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, [toastManager]);

  const addToast = (config: ToastConfig) => {
    debugLog('Adding toast:', config);
    return toastManager.addToast(config);
  };

  const removeToast = (id: string) => {
    debugLog('Removing toast:', id);
    toastManager.removeToast(id);
  };

  const clearToasts = () => {
    debugLog('Clearing all toasts');
    toastManager.clearToasts();
  };

  return {
    toasts,
    toast: {
      success: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => {
        addToast({
          title,
          type: 'success',
          ...config,
        });
      },
      error: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => {
        addToast({
          title,
          type: 'error',
          ...config,
        });
      },
      warning: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => {
        addToast({
          title,
          type: 'warning',
          ...config,
        });
      },
      info: (title: string, config?: Omit<ToastConfig, 'title' | 'type'>) => {
        addToast({
          title,
          type: 'info',
          ...config,
        });
      },
    },
    dismiss: removeToast,
    clear: clearToasts,
  };
}

/**
 * Helper function to display an error toast from an unknown error
 * @param error Unknown error object
 * @param title Optional title for the toast
 * @param config Optional additional configuration
 */
export function toastError(error: unknown, title: string = 'Error', config?: Omit<ToastConfig, 'title' | 'type'>) {
  const toastManager = ToastManager.getInstance();
  const message = normalizeError(error);
  
  debugLog('Displaying error toast:', title, message);
  
  toastManager.addToast({
    title,
    description: message,
    type: 'error',
    ...config,
  });
}

/**
 * Helper function to display a success toast
 * @param title Title for the toast
 * @param config Optional additional configuration
 */
export function toastSuccess(title: string, config?: Omit<ToastConfig, 'title' | 'type'>) {
  const toastManager = ToastManager.getInstance();
  
  debugLog('Displaying success toast:', title);
  
  toastManager.addToast({
    title,
    type: 'success',
    ...config,
  });
}