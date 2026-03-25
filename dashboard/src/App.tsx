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

export function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/news" element={<DashboardLayout><NewsManagementPage /></DashboardLayout>} />
          <Route path="/dashboard/files" element={<DashboardLayout><FileManagerPage /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}
