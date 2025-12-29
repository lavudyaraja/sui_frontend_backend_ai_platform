import { toast } from '@/lib/hooks/use-toast';

export function handleApiError(error: unknown, defaultMessage = 'An error occurred'): void {
  let message = defaultMessage;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  console.error('API Error:', error);
  toast({
    title: 'Error',
    description: message,
  });
}

export function handleFormError(error: unknown, fieldErrors: Record<string, string> = {}): void {
  let message = 'Please check the form for errors';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  console.error('Form Error:', error);
  toast({
    title: 'Form Error',
    description: message,
  });
}

export function handleNetworkError(error: unknown): void {
  const message = 'Network error. Please check your connection and try again.';
  
  console.error('Network Error:', error);
  toast({
    title: 'Network Error',
    description: message,
  });
}