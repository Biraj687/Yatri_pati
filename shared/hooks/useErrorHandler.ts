import { useCallback, useState, useRef } from 'react';
import { 
  AppError, 
  ErrorContext, 
  ErrorOptions, 
  createAppError, 
  apiErrorToAppError, 
  logError, 
  getUserFriendlyMessage,
  isRetryable 
} from '../utils/errors';

interface UseErrorHandlerOptions {
  component?: string;
  defaultContext?: ErrorContext;
  autoLog?: boolean;
  showUserNotifications?: boolean;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  userMessage: string | null;
  hasError: boolean;
  handleError: (error: unknown, context?: ErrorContext) => AppError;
  clearError: () => void;
  isRetryable: boolean;
  withErrorHandling: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: ErrorContext
  ) => T;
}

/**
 * Hook for standardized error handling in React components
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    component = 'UnknownComponent',
    defaultContext = {},
    autoLog = true,
    showUserNotifications = false
  } = options;

  const [error, setError] = useState<AppError | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const errorRef = useRef<AppError | null>(null);

  const handleError = useCallback((error: unknown, context: ErrorContext = {}): AppError => {
    // Convert to AppError
    const appError = apiErrorToAppError(error, {
      component,
      ...defaultContext,
      ...context
    });

    // Update state
    setError(appError);
    errorRef.current = appError;

    // Get user-friendly message
    const message = getUserFriendlyMessage(appError);
    setUserMessage(message);

    // Log error if enabled
    if (autoLog) {
      logError(appError, context);
    }

    // Show user notification if enabled
    if (showUserNotifications && typeof window !== 'undefined') {
      // In a real app, you might use a toast notification system
      console.warn('User notification:', message);
      // Example: toast.error(message);
    }

    return appError;
  }, [component, defaultContext, autoLog, showUserNotifications]);

  const clearError = useCallback(() => {
    setError(null);
    setUserMessage(null);
    errorRef.current = null;
  }, []);

  const withErrorHandling = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context: ErrorContext = {}
  ): T => {
    return (async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      try {
        clearError();
        return await fn(...args);
      } catch (err) {
        handleError(err, context);
        return null;
      }
    }) as T;
  }, [handleError, clearError]);

  return {
    error,
    userMessage,
    hasError: error !== null,
    handleError,
    clearError,
    isRetryable: error ? isRetryable(error) : false,
    withErrorHandling
  };
}

/**
 * Hook for handling async operations with error states
 */
interface UseAsyncErrorHandlerOptions<T> extends UseErrorHandlerOptions {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

interface UseAsyncErrorHandlerReturn<T> extends UseErrorHandlerReturn {
  data: T | null;
  loading: boolean;
  execute: (promise: Promise<T>, context?: ErrorContext) => Promise<T | null>;
  reset: () => void;
}

export function useAsyncErrorHandler<T = any>(
  options: UseAsyncErrorHandlerOptions<T> = {}
): UseAsyncErrorHandlerReturn<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    ...errorHandlerOptions
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const errorHandler = useErrorHandler(errorHandlerOptions);

  const execute = useCallback(async (
    promise: Promise<T>,
    context: ErrorContext = {}
  ): Promise<T | null> => {
    setLoading(true);
    errorHandler.clearError();

    try {
      const result = await promise;
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const appError = errorHandler.handleError(err, context);
      
      if (onError) {
        onError(appError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [errorHandler, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    errorHandler.clearError();
  }, [initialData, errorHandler]);

  return {
    ...errorHandler,
    data,
    loading,
    execute,
    reset
  };
}

/**
 * Hook for handling form validation errors
 */
interface UseFormErrorHandlerOptions extends UseErrorHandlerOptions {
  fieldNames?: string[];
}

interface UseFormErrorHandlerReturn extends UseErrorHandlerReturn {
  fieldErrors: Record<string, string>;
  setFieldError: (field: string, message: string) => void;
  clearFieldError: (field: string) => void;
  clearAllFieldErrors: () => void;
  hasFieldErrors: boolean;
}

export function useFormErrorHandler(
  options: UseFormErrorHandlerOptions = {}
): UseFormErrorHandlerReturn {
  const { fieldNames = [] } = options;
  const errorHandler = useErrorHandler(options);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const handleErrorWithFieldMapping = useCallback((error: unknown, context: ErrorContext = {}) => {
    const appError = errorHandler.handleError(error, context);
    
    // Try to extract field errors from the error
    if (error && typeof error === 'object') {
      const err = error as any;
      
      // Handle validation errors with field mappings
      if (err.fieldErrors || err.errors) {
        const fieldErrors = err.fieldErrors || err.errors;
        
        if (typeof fieldErrors === 'object') {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            if (typeof message === 'string') {
              setFieldError(field, message);
            }
          });
        }
      }
    }
    
    return appError;
  }, [errorHandler, setFieldError]);

  return {
    ...errorHandler,
    handleError: handleErrorWithFieldMapping,
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    hasFieldErrors: Object.keys(fieldErrors).length > 0
  };
}