/**
 * Authentication Context - Manages user authentication state
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
      const devUser: User = {
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

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: Replace with actual API call
    const mockUser: User = {
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

  const hasRole = useCallback((role: string | string[]) => {
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
