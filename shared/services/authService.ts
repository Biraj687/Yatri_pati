/**
 * Authentication Service - Handles user authentication and token management
 * Prepared for backend integration (currently uses mock data)
 */

import { mainApiClient } from './apiClient';
import type { ApiResponse } from '../types';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

class AuthService {
  private api = mainApiClient;
  private tokenKey = 'yatripati_auth_token';
  private refreshTokenKey = 'yatripati_refresh_token';
  private userKey = 'yatripati_user';

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/auth/login', credentials, {
      mockData: () => this.mockLogin(credentials)
    });
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/auth/register', data, {
      mockData: () => this.mockRegister(data)
    });
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    // Clear local storage
    this.clearAuthData();
    
    // Call logout endpoint if token exists
    const token = this.getToken();
    if (token) {
      return this.api.post<void>('/auth/logout', {}, {
        mockData: () => Promise.resolve()
      });
    }
    
    return Promise.resolve({
      success: true,
      data: undefined
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available'
      };
    }

    return this.api.post<{ token: string; refreshToken: string }>('/auth/refresh', { refreshToken }, {
      mockData: () => this.mockRefreshToken(refreshToken)
    });
  }

  /**
   * Get current user from stored data
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check token expiration (simple implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Store auth data after successful login
   */
  storeAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    
    // Update API client with new token
    this.api.setAuthToken(response.token);
  }

  /**
   * Clear all auth data
   */
  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    
    // Clear token from API client
    this.api.setAuthToken(null);
  }

  /**
   * Initialize auth state (call on app startup)
   */
  initialize(): void {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      this.api.setAuthToken(token);
    } else {
      this.clearAuthData();
    }
  }

  // Mock implementations
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.email === 'admin@yatripati.com' && credentials.password === 'password') {
      const response: AuthResponse = {
        user: {
          id: '1',
          email: 'admin@yatripati.com',
          name: 'बिराज प्याकुरेल',
          role: 'admin',
          avatar: '/assets/pp.jpg'
        },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600
      };

      this.storeAuthData(response);
      return response;
    }

    throw new Error('Invalid credentials');
  }

  private async mockRegister(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const response: AuthResponse = {
      user: {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'editor'
      },
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600
    };

    this.storeAuthData(response);
    return response;
  }

  private async mockRefreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (refreshToken.startsWith('mock_refresh_token_')) {
      return {
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      };
    }

    throw new Error('Invalid refresh token');
  }
}

// Export singleton instance
export const authService = new AuthService();

// Initialize on import
authService.initialize();