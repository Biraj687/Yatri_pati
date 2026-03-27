/**
 * Authentication Context - Manages user authentication state
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem('dashboardAuthToken');
    const userData = localStorage.getItem('dashboardUser');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data', e);
        localStorage.removeItem('dashboardAuthToken');
        localStorage.removeItem('dashboardUser');
      }
    } else {
      // Auto-login for development - remove this in production
      const devUser = {
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
      };
      setUser(devUser);
      localStorage.setItem('dashboardAuthToken', 'dev-token-' + Date.now());
      localStorage.setItem('dashboardUser', JSON.stringify(devUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, _password) => {
    // TODO: Replace with actual API call
    const mockUser = {
      email,
      name: email.split('@')[0],
      role: 'admin',
    };
    setUser(mockUser);
    localStorage.setItem('dashboardAuthToken', 'token-' + Date.now());
    localStorage.setItem('dashboardUser', JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dashboardAuthToken');
    localStorage.removeItem('dashboardUser');
  }, []);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}