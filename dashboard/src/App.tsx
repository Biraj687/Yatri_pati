import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { AuthProvider } from '@context/AuthContext';
import { NotificationProvider } from '@context/NotificationContext';
import { DashboardProvider } from '@context/DashboardContext';
import { DashboardLayout } from '@layouts/DashboardLayout';
import {
  DashboardHome,
  NewsManagementPage,
  FileManagerPage,
  AnalyticsPage,
  SettingsPage,
  AdvertisementManagementPage,
} from '@pages';
import { appConfig } from './config';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        }
      />
      <Route
        path="/news"
        element={
          <DashboardLayout>
            <NewsManagementPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/files"
        element={
          <DashboardLayout>
            <FileManagerPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/advertisements"
        element={
          <DashboardLayout>
            <AdvertisementManagementPage />
          </DashboardLayout>
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
            <DashboardProvider>
              <AppRoutes />
            </DashboardProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
