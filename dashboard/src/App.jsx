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
    
      <Route
        path="/"
        element={
          
            <DashboardHome />
          </DashboardLayout>
        }
      />
      <Route
        path="/news"
        element={
          
            <NewsManagementPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/files"
        element={
          
            <FileManagerPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          
            <AnalyticsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          
            <SettingsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/advertisements"
        element={
          
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
    
      <BrowserRouter basename={basename}>
        
          
            
              <AppRoutes />
            </DashboardProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

