import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorFallbackProps, apiErrorToAppError, logError, getUserFriendlyMessage } from '../utils/errors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  resetOnChange?: any[];
}

interface ErrorBoundaryState {
  error: AppError | null;
  hasError: boolean;
}

/**
 * Global error boundary component for React applications
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Convert error to AppError
    const appError = apiErrorToAppError(error, {
      component: 'ErrorBoundary',
      operation: 'getDerivedStateFromError'
    });
    
    return {
      error: appError,
      hasError: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Convert error to AppError
    const appError = apiErrorToAppError(error, {
      component: 'ErrorBoundary',
      operation: 'componentDidCatch',
      componentStack: errorInfo.componentStack
    });

    // Log the error
    logError(appError, {
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }

    // Update state
    this.setState({
      error: appError,
      hasError: true
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state when resetOnChange dependencies change
    if (this.state.hasError && this.props.resetOnChange) {
      const prevDeps = prevProps.resetOnChange || [];
      const currentDeps = this.props.resetOnChange || [];
      
      if (prevDeps.length !== currentDeps.length) {
        this.resetErrorBoundary();
        return;
      }
      
      for (let i = 0; i < prevDeps.length; i++) {
        if (prevDeps[i] !== currentDeps[i]) {
          this.resetErrorBoundary();
          return;
        }
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      error: null,
      hasError: false
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetErrorBoundary} />;
      }

      // Default fallback UI
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }

  private renderDefaultFallback() {
    const { error } = this.state;
    const userFriendlyMessage = error ? getUserFriendlyMessage(error) : 'An unexpected error occurred';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{userFriendlyMessage}</p>
            
            {error && (
              <div className="mb-6 p-4 bg-gray-100 rounded text-left">
                <p className="text-sm font-mono text-gray-700 break-all">
                  <span className="font-semibold">Error:</span> {error.message}
                </p>
                {error.code && (
                  <p className="text-sm font-mono text-gray-700 mt-1">
                    <span className="font-semibold">Code:</span> {error.code}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={this.resetErrorBoundary}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Reload Page
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Go to Homepage
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Simple error display component for showing errors inline
 */
export function ErrorDisplay({ error, onRetry }: { error: AppError | null; onRetry?: () => void }) {
  if (!error) return null;

  const userFriendlyMessage = getUserFriendlyMessage(error);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{userFriendlyMessage}</p>
            {error.code && (
              <p className="mt-1 text-xs font-mono opacity-75">Code: {error.code}</p>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}