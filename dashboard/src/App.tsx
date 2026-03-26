import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '@context/DashboardContext';
import { DashboardLayout } from '@layouts/DashboardLayout';
import {
  DashboardHome,
  NewsManagementPage,
  FileManagerPage,
  AnalyticsPage,
  SettingsPage,
} from '@pages';
import { authConfig, appConfig } from './config';

// Simple authentication wrapper for dashboard
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: string
) {
  return function WithAuthComponent(props: P) {
    // Check authentication from localStorage using config
    const isAuthenticated = localStorage.getItem(authConfig.tokenKey) !== null;
    const user = localStorage.getItem(authConfig.userKey);
    const userRole = user ? JSON.parse(user).role : null;
    
    if (!isAuthenticated) {
      // Redirect to login page
      return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Simple login page component
function LoginPage({ redirectTo = '/' }: { redirectTo?: string }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock authentication - in production, this would call an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === authConfig.demoEmail && password === authConfig.demoPassword) {
        // Store mock auth data using config keys
        const mockUser = {
          id: '1',
          email: authConfig.demoEmail,
          name: 'Admin User',
          role: 'admin' as const,
        };
        
        localStorage.setItem(authConfig.tokenKey, 'mock-jwt-token');
        localStorage.setItem(authConfig.userKey, JSON.stringify(mockUser));
        localStorage.setItem(authConfig.refreshKey, 'mock-refresh-token');
        
        // Redirect to dashboard
        window.location.href = redirectTo;
      } else {
        setError(`Invalid email or password. Try ${authConfig.demoEmail} / ${authConfig.demoPassword}`);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem(authConfig.tokenKey) !== null;
    if (isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Login</h2>
          <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={authConfig.demoEmail}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={authConfig.demoPassword}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p className="font-mono">Email: {authConfig.demoEmail}</p>
            <p className="font-mono">Password: {authConfig.demoPassword}</p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create protected versions of the pages
const ProtectedDashboardHome = withAuth(DashboardHome, 'admin');
const ProtectedNewsManagement = withAuth(NewsManagementPage, 'editor');
const ProtectedFileManager = withAuth(FileManagerPage, 'editor');
const ProtectedAnalytics = withAuth(AnalyticsPage, 'viewer');
const ProtectedSettings = withAuth(SettingsPage, 'admin');

function App() {
  // Use appConfig for basename - in development use '/', in production use dashboardBasePath
  const basename = import.meta.env.DEV ? '/' : appConfig.dashboardBasePath;
  
  return (
    <BrowserRouter basename={basename}>
      <DashboardProvider>
        <Routes>
          <Route path="/login" element={<LoginPage redirectTo="/" />} />
          <Route path="/" element={
            <DashboardLayout>
              <ProtectedDashboardHome />
            </DashboardLayout>
          } />
          <Route path="/news" element={
            <DashboardLayout>
              <ProtectedNewsManagement />
            </DashboardLayout>
          } />
          <Route path="/files" element={
            <DashboardLayout>
              <ProtectedFileManager />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout>
              <ProtectedAnalytics />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <ProtectedSettings />
            </DashboardLayout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
