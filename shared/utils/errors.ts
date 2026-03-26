/**
 * Standardized error handling utilities for Yatripati applications
 */

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
  timestamp: string;
}

export interface ErrorContext {
  component?: string;
  operation?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export interface ErrorOptions {
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  context?: ErrorContext;
  retryable?: boolean;
  userFriendly?: boolean;
}

/**
 * Create a standardized application error
 */
export function createAppError(
  code: string,
  message: string,
  options: ErrorOptions = {}
): AppError {
  const {
    category = ErrorCategory.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    context = {},
    retryable = false,
    userFriendly = true
  } = options;

  return {
    code: `${category.toUpperCase()}_${code}`,
    message,
    details: {
      category,
      severity,
      retryable,
      userFriendly,
      context,
      ...context
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Common error factory functions
 */
export const ErrorFactory = {
  network: (message: string, context?: ErrorContext) =>
    createAppError('NETWORK_ERROR', message, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      retryable: true,
      context
    }),

  validation: (message: string, context?: ErrorContext) =>
    createAppError('VALIDATION_ERROR', message, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      context
    }),

  auth: (message: string, context?: ErrorContext) =>
    createAppError('AUTH_ERROR', message, {
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      retryable: false,
      context
    }),

  notFound: (resource: string, context?: ErrorContext) =>
    createAppError('NOT_FOUND', `${resource} not found`, {
      category: ErrorCategory.NOT_FOUND,
      severity: ErrorSeverity.LOW,
      retryable: false,
      context
    }),

  server: (message: string, context?: ErrorContext) =>
    createAppError('SERVER_ERROR', message, {
      category: ErrorCategory.SERVER,
      severity: ErrorSeverity.CRITICAL,
      retryable: true,
      context
    }),

  client: (message: string, context?: ErrorContext) =>
    createAppError('CLIENT_ERROR', message, {
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      context
    })
};

/**
 * Convert API response error to AppError
 */
export function apiErrorToAppError(
  error: unknown,
  context?: ErrorContext
): AppError {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    
    // Handle HTTP errors
    if (err.statusCode || err.status) {
      const status = err.statusCode || err.status;
      
      if (status >= 400 && status < 500) {
        if (status === 401 || status === 403) {
          return ErrorFactory.auth(
            err.message || 'Authentication required',
            { ...context, statusCode: status }
          );
        } else if (status === 404) {
          return ErrorFactory.notFound(
            err.message || 'Resource',
            { ...context, statusCode: status }
          );
        } else if (status === 422) {
          return ErrorFactory.validation(
            err.message || 'Validation failed',
            { ...context, statusCode: status }
          );
        } else {
          return ErrorFactory.client(
            err.message || `Client error (${status})`,
            { ...context, statusCode: status }
          );
        }
      } else if (status >= 500) {
        return ErrorFactory.server(
          err.message || `Server error (${status})`,
          { ...context, statusCode: status }
        );
      }
    }
    
    // Handle network errors
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      return ErrorFactory.network(
        'Network connection failed',
        { ...context, originalError: err.message }
      );
    }
    
    // Handle timeout errors
    if (err.name === 'AbortError') {
      return ErrorFactory.network(
        'Request timeout',
        { ...context, originalError: err.message }
      );
    }
    
    // Generic error with message
    if (err.message) {
      return createAppError(
        'UNKNOWN_ERROR',
        err.message,
        {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.MEDIUM,
          context: { ...context, originalError: err }
        }
      );
    }
  }
  
  // Fallback for unknown errors
  return createAppError(
    'UNKNOWN_ERROR',
    'An unknown error occurred',
    {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      context
    }
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  const { code, message } = error;
  
  // Map error codes to user-friendly messages
  const messageMap: Record<string, string> = {
    'NETWORK_NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
    'AUTHENTICATION_AUTH_ERROR': 'Please log in to continue.',
    'AUTHORIZATION_AUTH_ERROR': 'You don\'t have permission to perform this action.',
    'NOT_FOUND_NOT_FOUND': 'The requested resource was not found.',
    'SERVER_SERVER_ERROR': 'Something went wrong on our end. Please try again later.',
    'VALIDATION_VALIDATION_ERROR': 'Please check your input and try again.',
    'CLIENT_CLIENT_ERROR': 'There was an issue with your request. Please try again.'
  };
  
  return messageMap[code] || message || 'An unexpected error occurred.';
}

/**
 * Check if error is retryable
 */
export function isRetryable(error: AppError): boolean {
  const details = error.details as any;
  return details?.retryable === true;
}

/**
 * Log error with appropriate severity
 */
export function logError(error: AppError, additionalContext?: ErrorContext) {
  const details = error.details as any;
  const severity = details?.severity || ErrorSeverity.MEDIUM;
  const context = { ...details?.context, ...additionalContext };
  
  const logEntry = {
    timestamp: error.timestamp,
    code: error.code,
    message: error.message,
    severity,
    context
  };
  
  switch (severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      console.error('🚨 Critical Error:', logEntry);
      // In production, this would send to error monitoring service
      break;
    case ErrorSeverity.MEDIUM:
      console.warn('⚠️ Warning:', logEntry);
      break;
    case ErrorSeverity.LOW:
      console.info('ℹ️ Info:', logEntry);
      break;
  }
  
  return logEntry;
}

/**
 * Error boundary state interface
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Default error boundary fallback component props
 */
export interface ErrorFallbackProps {
  error: AppError;
  resetError: () => void;
}

// Note: React-specific error boundary components should be created in the components directory
// This file contains only error utilities, not React components