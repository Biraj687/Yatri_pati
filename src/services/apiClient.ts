import { apiRateLimiter, generateRateLimitKey, RateLimitError } from './rateLimiter';
import { sanitizeArticle } from './sanitizer';

/**
 * Secure API Client
 * 
 * CRITICAL: Never expose API keys in frontend code
 * All API calls should route through a backend proxy that:
 * 1. Handles authentication and API keys securely
 * 2. Implements server-side rate limiting (per IP/user)
 * 3. Validates and sanitizes all responses
 * 4. Logs and monitors requests
 * 
 * Frontend responsibilities:
 * 1. Rate limiting (supplementary)
 * 2. Input validation
 * 3. Response sanitization
 * 4. User feedback
 */

export interface ApiClientConfig {
  baseUrl: string;
  version?: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class ApiClient {
  private baseUrl: string;
  private version: string;
  private timeout: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_URL;
    this.version = config.version || 'v1';
    this.timeout = config.timeout || 30000; // 30 seconds

    // Verify baseUrl is set
    if (!this.baseUrl) {
      console.error('API_URL not configured. Set VITE_API_URL in .env file');
    }
  }

  /**
   * Make a GET request with rate limiting
   */
  async get<T>(endpoint: string, rateLimitKey?: string): Promise<ApiResponse<T>> {
    const key = rateLimitKey || generateRateLimitKey(endpoint);

    // Check rate limit
    if (!apiRateLimiter.isAllowed(key)) {
      const resetTime = apiRateLimiter.getResetTime(key);
      const remaining = apiRateLimiter.getRemaining(key);
      
      throw new RateLimitError(resetTime, remaining);
    }

    try {
      const url = this.constructUrl(endpoint);
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a POST request with rate limiting (stricter limits)
   */
  async post<T>(
    endpoint: string,
    data: any,
    rateLimitKey?: string
  ): Promise<ApiResponse<T>> {
    const key = rateLimitKey || generateRateLimitKey(endpoint);

    // Check rate limit (stricter for POST)
    if (!apiRateLimiter.isAllowed(key)) {
      const resetTime = apiRateLimiter.getResetTime(key);
      const remaining = apiRateLimiter.getRemaining(key);
      
      throw new RateLimitError(resetTime, remaining);
    }

    try {
      const url = this.constructUrl(endpoint);
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Construct full URL with versioning
   */
  private constructUrl(endpoint: string): string {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // If using a proxy, path might include version
    // If not, add version here
    return `${baseUrl}/${this.version}${path}`;
  }

  /**
   * Get request headers with versioning
   */
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Version': this.version,
      'X-Client-Type': 'web'
    };
  }

  /**
   * Fetch with timeout
   */
  private fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), this.timeout)
      )
    ]);
  }

  /**
   * Handle successful responses
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
        statusCode: response.status
      };
    }

    const data = await response.json();

    // Sanitize article data if present
    if (data && typeof data === 'object') {
      data.articles = data.articles?.map((article: any) => sanitizeArticle(article));
      if (data.hero) data.hero = sanitizeArticle(data.hero);
      if (data.featured) data.featured = sanitizeArticle(data.featured);
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status
    };
  }

  /**
   * Handle errors
   */
  private handleError<T>(error: any): ApiResponse<T> {
    let message = 'An error occurred';

    if (error instanceof RateLimitError) {
      message = `Rate limited. Try again in ${error.resetTime}s`;
    } else if (error instanceof TypeError) {
      message = 'Network error. Check your connection.';
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.error('[API Error]', message);

    return {
      success: false,
      error: message
    };
  }

  /**
   * Get remaining rate limit for an endpoint
   */
  getRateLimit(endpoint: string): { remaining: number; resetTime: number } {
    const key = generateRateLimitKey(endpoint);
    return {
      remaining: apiRateLimiter.getRemaining(key),
      resetTime: apiRateLimiter.getResetTime(key)
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  version: 'v1'
});
