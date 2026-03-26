import { useState, useCallback, useEffect } from 'react';
import { useAsync } from './useAsync';
import { authService, type User, type LoginCredentials, type RegisterData, type AuthResponse } from '../services/authService';

/**
 * Hook for authentication state and operations
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });

  const [token, setToken] = useState<string | null>(() => {
    return authService.getToken();
  });

  const loginState = useAsync<AuthResponse>();
  const registerState = useAsync<AuthResponse>();
  const refreshState = useAsync<{ token: string; refreshToken: string }>();

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: User['role']) => {
    return authService.hasRole(role);
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials, options?: {
    onSuccess?: (response: AuthResponse) => void;
    onError?: (error: string) => void;
  }) => {
    await loginState.execute(async () => {
      const response = await authService.login(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const authResponse = response.data;

      // Store auth data via service
      authService.storeAuthData(authResponse);
      
      // Update state
      setUser(authResponse.user);
      setToken(authResponse.token);

      options?.onSuccess?.(authResponse);
      return authResponse;
    }, {
      onError: options?.onError,
    });
  }, [loginState]);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData, options?: {
    onSuccess?: (response: AuthResponse) => void;
    onError?: (error: string) => void;
  }) => {
    await registerState.execute(async () => {
      const response = await authService.register(data);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      const authResponse = response.data;

      // Store auth data via service
      authService.storeAuthData(authResponse);
      
      // Update state
      setUser(authResponse.user);
      setToken(authResponse.token);

      options?.onSuccess?.(authResponse);
      return authResponse;
    }, {
      onError: options?.onError,
    });
  }, [registerState]);

  /**
   * Logout user
   */
  const logout = useCallback(async (options?: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) => {
    // Use the auth service logout which handles API call and local storage
    const response = await authService.logout();
    
    if (!response.success) {
      options?.onError?.(response.error || 'Logout failed');
      return;
    }

    // Update state
    setUser(null);
    setToken(null);

    options?.onSuccess?.();
  }, []);

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async (options?: {
    onSuccess?: (tokens: { token: string; refreshToken: string }) => void;
    onError?: (error: string) => void;
  }) => {
    await refreshState.execute(async () => {
      const response = await authService.refreshToken();

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to refresh token');
      }

      const tokens = response.data;

      // Update stored token
      localStorage.setItem('yatripati_auth_token', tokens.token);
      localStorage.setItem('yatripati_refresh_token', tokens.refreshToken);
      
      // Update API client
      authService['api'].setAuthToken(tokens.token);
      
      // Update state
      setToken(tokens.token);

      options?.onSuccess?.(tokens);
      return tokens;
    }, {
      onError: options?.onError,
    });
  }, [refreshState]);

  /**
   * Initialize auth state (call on app startup)
   */
  const initialize = useCallback(() => {
    authService.initialize();
    
    // Update state from storage
    setUser(authService.getCurrentUser());
    setToken(authService.getToken());
  }, []);

  /**
   * Update user profile locally (for UI updates)
   */
  const updateUserProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    
    // Update local storage
    localStorage.setItem('yatripati_user', JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
  }, [user]);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh if token expires in less than 5 minutes
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          refreshToken().catch(() => {
            // If refresh fails, logout
            logout();
          });
        }
      } catch {
        // Invalid token, logout
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    checkTokenExpiration(); // Initial check

    return () => clearInterval(interval);
  }, [token, refreshToken, logout]);

  return {
    // State
    user,
    token,
    isAuthenticated: isAuthenticated(),
    
    // Login operations
    login,
    loggingIn: loginState.loading,
    loginError: loginState.error,
    loginResponse: loginState.data,
    
    // Register operations
    register,
    registering: registerState.loading,
    registerError: registerState.error,
    registerResponse: registerState.data,
    
    // Token operations
    refreshToken,
    refreshingToken: refreshState.loading,
    refreshError: refreshState.error,
    
    // Logout
    logout,
    
    // Role checking
    hasRole,
    isAdmin: hasRole('admin'),
    isEditor: hasRole('editor') || hasRole('admin'),
    isViewer: hasRole('viewer') || hasRole('editor') || hasRole('admin'),
    
    // Profile updates
    updateUserProfile,
    
    // Initialization
    initialize,
    
    // Reset methods
    resetLogin: () => loginState.reset(),
    resetRegister: () => registerState.reset(),
    resetRefresh: () => refreshState.reset(),
  };
}

/**
 * Hook for protected route authentication
 */
export function useRequireAuth(requiredRole?: User['role']) {
  const auth = useAuth();
  
  const hasAccess = useCallback(() => {
    if (!auth.isAuthenticated) {
      return false;
    }
    
    if (requiredRole && !auth.hasRole(requiredRole)) {
      return false;
    }
    
    return true;
  }, [auth.isAuthenticated, auth.hasRole, requiredRole]);
  
  return {
    ...auth,
    hasAccess: hasAccess(),
    requiredRole,
  };
}