/**
 * Authentication Service - Handles user authentication and token management
 * Prepared for backend integration (currently uses mock data)
 */
import { mainApiClient } from './apiClient';
class AuthService {
    constructor() {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mainApiClient
        });
        Object.defineProperty(this, "tokenKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'yatripati_auth_token'
        });
        Object.defineProperty(this, "refreshTokenKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'yatripati_refresh_token'
        });
        Object.defineProperty(this, "userKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'yatripati_user'
        });
    }
    /**
     * Login user with credentials
     */
    async login(credentials) {
        return this.api.post('/auth/login', credentials, {
            mockData: () => this.mockLogin(credentials)
        });
    }
    /**
     * Register new user
     */
    async register(data) {
        return this.api.post('/auth/register', data, {
            mockData: () => this.mockRegister(data)
        });
    }
    /**
     * Logout user
     */
    async logout() {
        // Clear local storage
        this.clearAuthData();
        // Call logout endpoint if token exists
        const token = this.getToken();
        if (token) {
            return this.api.post('/auth/logout', {}, {
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
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return {
                success: false,
                error: 'No refresh token available'
            };
        }
        return this.api.post('/auth/refresh', { refreshToken }, {
            mockData: () => this.mockRefreshToken(refreshToken)
        });
    }
    /**
     * Get current user from stored data
     */
    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(this.userKey);
            return userStr ? JSON.parse(userStr) : null;
        }
        catch {
            return null;
        }
    }
    /**
     * Get stored auth token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    /**
     * Get stored refresh token
     */
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = this.getToken();
        if (!token)
            return false;
        // Check token expiration (simple implementation)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        }
        catch {
            return false;
        }
    }
    /**
     * Check if user has specific role
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.role === role;
    }
    /**
     * Store auth data after successful login
     */
    storeAuthData(response) {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        // Update API client with new token
        this.api.setAuthToken(response.token);
    }
    /**
     * Clear all auth data
     */
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        // Clear token from API client
        this.api.setAuthToken(null);
    }
    /**
     * Initialize auth state (call on app startup)
     */
    initialize() {
        const token = this.getToken();
        if (token && this.isAuthenticated()) {
            this.api.setAuthToken(token);
        }
        else {
            this.clearAuthData();
        }
    }
    // Mock implementations
    async mockLogin(credentials) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        if (credentials.email === 'admin@yatripati.com' && credentials.password === 'password') {
            const response = {
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
    async mockRegister(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = {
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
    async mockRefreshToken(refreshToken) {
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
