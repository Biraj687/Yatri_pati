import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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



function App() {
  // Use appConfig for basename - in development use '/', in production use dashboardBasePath
  const basename = import.meta.env.DEV ? '/' : appConfig.dashboardBasePath;
  
  return (
    <BrowserRouter basename={basename}>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          } />
          <Route path="/news" element={
            <DashboardLayout>
              <NewsManagementPage />
            </DashboardLayout>
          } />
          <Route path="/files" element={
            <DashboardLayout>
              <FileManagerPage />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          } />
          <Route path="/advertisements" element={
            <DashboardLayout>
              <AdvertisementManagementPage />
            </DashboardLayout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
