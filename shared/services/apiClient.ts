/**
 * Unified API Client for Yatripati
 * Shared between main app and dashboard
 */

import { apiErrorToAppError, logError } from '../utils/errors';

export interface ApiClientConfig {
  baseUrl: string;
  version?: string;
  timeout?: number;
  maxRetries?: number;
  useMock?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  retries?: number;
  errorDetails?: any;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retryOnFailure?: boolean;
  mockData?: T | (() => Promise<T>);
}

// Cache for in-memory caching (simple implementation)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class ApiClient {
  private baseUrl: string;
  private version: string;
  private timeout: number;
  private maxRetries: number;
  private useMock: boolean;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_URL || '';
    this.version = config.version || 'v1';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.useMock = config.useMock ?? import.meta.env.VITE_USE_MOCK_DATA === 'true';

    // Validate configuration
    if (!this.useMock && !this.baseUrl) {
      console.warn('API_URL not configured. Set VITE_API_URL in .env file');
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Make a GET request with caching and retry logic
   */
  async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = `GET:${endpoint}`;
    
    // Check cache first (if not disabled)
    if (!options.retryOnFailure) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return {
          success: true,
          data: cached.data,
          statusCode: 200
        };
      }
    }

    // Use mock data if enabled
    if (this.useMock && options.mockData) {
      return this.handleMockResponse<T>(options.mockData);
    }

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const url = this.constructUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
          method: 'GET',
          headers: this.getHeaders(options.headers)
        });

        const result = await this.handleResponse<T>(response);
        
        // Cache successful responses
        if (result.success && result.data) {
          cache.set(cacheKey, { data: result.data, timestamp: Date.now() });
        }
        
        return { ...result, retries: attempt };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry if it's not a network error
        if (!this.shouldRetry(error as Error)) {
          break;
        }
        
        // Exponential backoff
        if (attempt < this.maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return this.handleError<T>(lastError);
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Use mock data if enabled
    if (this.useMock && options.mockData) {
      return this.handleMockResponse<T>(options.mockData);
    }

    try {
      const url = this.constructUrl(endpoint);
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Use mock data if enabled
    if (this.useMock && options.mockData) {
      return this.handleMockResponse<T>(options.mockData);
    }

    try {
      const url = this.constructUrl(endpoint);
      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Use mock data if enabled
    if (this.useMock && options.mockData) {
      return this.handleMockResponse<T>(options.mockData);
    }

    try {
      const url = this.constructUrl(endpoint);
      const response = await this.fetchWithTimeout(url, {
        method: 'DELETE',
        headers: this.getHeaders(options.headers)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Clear cache for specific endpoint or all
   */
  clearCache(endpoint?: string) {
    if (endpoint) {
      const prefix = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      for (const key of cache.keys()) {
        if (key.includes(prefix)) {
          cache.delete(key);
        }
      }
    } else {
      cache.clear();
    }
  }

  // Private methods
  private constructUrl(endpoint: string): string {
    if (this.useMock) {
      // Return a dummy URL for mock mode
      return `https://mock.api/${this.version}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    }

    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${baseUrl}/${this.version}${path}`;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Version': this.version,
      'X-Client-Type': 'web',
      ...customHeaders
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}` };
      }

      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
        statusCode: response.status
      };
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data: data as T,
        statusCode: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        statusCode: response.status
      };
    }
  }

  private handleMockResponse<T>(mockData: any): ApiResponse<T> {
    return new Promise<ApiResponse<T>>((resolve) => {
      setTimeout(() => {
        const data = typeof mockData === 'function' 
          ? (mockData() as T) 
          : (mockData as T);
        
        resolve({
          success: true,
          data,
          statusCode: 200
        });
      }, 300); // Simulate network delay
    });
  }

  private handleError<T>(error: unknown, context: Record<string, any> = {}): ApiResponse<T> {
    // Convert to standardized AppError
    const appError = apiErrorToAppError(error, {
      component: 'ApiClient',
      operation: 'request',
      ...context
    });

    // Log the error using our standardized logging
    logError(appError, {
      ...context,
      timestamp: new Date().toISOString()
    });

    // Return API response with error details
    return {
      success: false,
      error: appError.message,
      errorDetails: appError.details,
      statusCode: (appError.details as any)?.statusCode
    };
  }

  private shouldRetry(error: Error): boolean {
    // Retry on network errors, timeouts, and 5xx errors
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('timeout') || 
           message.includes('aborted');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instances for different contexts
export const mainApiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  version: 'v1',
  useMock: import.meta.env.VITE_USE_MOCK_DATA === 'true'
});

export const dashboardApiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:3000/api',
  version: 'v1',
  useMock: import.meta.env.VITE_USE_MOCK_DATA === 'true'
});