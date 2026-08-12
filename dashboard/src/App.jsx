import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { AuthProvider } from '@context/AuthContext';
import { NotificationProvider } from '@context/NotificationContext';
import { DashboardProvider } from '@context/DashboardContext';
import { FrontendControlProvider } from '@context/FrontendControlContext';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { LoginPage } from '@pages/LoginPage';
import {
  DashboardHome,
  NewsManagementPage,
  CategoryManagementPage,
  AnalyticsPage,
  SettingsPage,
  AdvertisementManagementPage,
  ContentControlDashboard,
  BannerControlPage,
  SiteSettingsPage,
  MasterDashboard,
  LivePreviewPage,
} from '@pages';
import { appConfig } from './config';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <NewsManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <CategoryManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/advertisements"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <AdvertisementManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* New Comprehensive Dashboard Routes */}
      <Route
        path="/content-control"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <ContentControlDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <BannerControlPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/site-settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <SiteSettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* MASTER CONTROL DASHBOARD - Complete Frontend Control */}
      <Route
        path="/control-panel"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <MasterDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* LIVE PREVIEW - See real-time changes from Content Control Dashboard */}
      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <DashboardLayout>
            <LivePreviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const basename = import.meta.env.DEV ? '/' : appConfig.dashboardBasePath;

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <NotificationProvider>
            <FrontendControlProvider>
              <DashboardProvider>
                <AppRoutes />
              </DashboardProvider>
            </FrontendControlProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

