import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  hasRole: (role: User['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    login: async (credentials) => {
      await auth.login(credentials);
    },
    logout: async () => {
      await auth.logout();
    },
    register: async (data) => {
      await auth.register(data);
    },
    loading: auth.loggingIn || auth.registering,
    error: auth.loginError || auth.registerError,
    isAdmin: auth.isAdmin,
    isEditor: auth.isEditor,
    isViewer: auth.isViewer,
    hasRole: auth.hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

/**
 * Higher-order component for protecting routes
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: User['role']
) {
  return function WithAuthComponent(props: P) {
    const auth = useAuthContext();
    
    // Check authentication
    if (!auth.isAuthenticated) {
      // In a real app, you would redirect to login
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            <button
              onClick={() => {
                // Redirect to login (in a real app, you would use react-router)
                window.location.href = '/login';
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    // Check role if required
    if (requiredRole && !auth.hasRole(requiredRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Required role: {requiredRole}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}