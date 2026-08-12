/**
 * Standardized async state types for consistent data handling
 */

import type { ApiResponse } from './index';

/**
 * Standard async state for React components
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
}

/**
 * Create initial async state
 */
export function createAsyncState<T>(initialData: T | null = null): AsyncState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
    lastUpdated: undefined
  };
}

/**
 * Convert ApiResponse to AsyncState update
 */
export function apiResponseToStateUpdate<T>(
  response: ApiResponse<T>,
  currentState: AsyncState<T>
): Partial<AsyncState<T>> {
  if (response.success) {
    return {
      data: response.data ?? currentState.data,
      loading: false,
      error: null,
      lastUpdated: Date.now()
    };
  } else {
    return {
      loading: false,
      error: response.error || 'Unknown error',
      lastUpdated: Date.now()
    };
  }
}

/**
 * Standard async operation wrapper
 */
export async function withAsyncState<T>(
  operation: () => Promise<ApiResponse<T>>,
  onStateChange: (update: Partial<AsyncState<T>>) => void
): Promise<ApiResponse<T>> {
  // Set loading state
  onStateChange({ loading: true, error: null });
  
  try {
    const response = await operation();
    const update = apiResponseToStateUpdate(response, { data: null, loading: true, error: null });
    onStateChange(update);
    return response;
  } catch (error) {
    const errorResponse: ApiResponse<T> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    onStateChange({
      loading: false,
      error: errorResponse.error || 'Unknown error',
      lastUpdated: Date.now()
    });
    
    return errorResponse;
  }
}

/**
 * Paginated async state
 */
export interface PaginatedAsyncState<T> extends AsyncState<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Create initial paginated async state
 */
export function createPaginatedAsyncState<T>(): PaginatedAsyncState<T> {
  return {
    data: [],
    loading: false,
    error: null,
    lastUpdated: undefined,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    }
  };
}