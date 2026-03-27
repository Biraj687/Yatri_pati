/**
 * ProtectedRoute Component
 * Guards routes that require authentication
 * Can be used with or without React Router
 */

import React from 'react';
import { useAuth } from '../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

/**
 * Higher-order component for protecting routes
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallback,
}) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You need to log in to access this page.
            </p>
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )
    );
  }

  // Check role-based access (if required roles are specified)
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h1>
            <p className="text-gray-600 mb-6">
              Your role ({user.role}) does not have access to this resource.
            </p>
            <button
              onClick={() => {
                window.history.back();
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
};

/**
 * Hook for route protection
 */
export const useRequireAuth = (requiredRoles?: string[]) => {
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }

    if (isAuthenticated && user && requiredRoles && !requiredRoles.includes(user.role)) {
      window.location.href = '/access-denied';
    }
  }, [isAuthenticated, requiredRoles, user]);

  return {
    isAuthenticated,
    user,
    isAuthorized: 
      isAuthenticated &&
      (!requiredRoles || (user && requiredRoles.includes(user.role))),
  };
};
