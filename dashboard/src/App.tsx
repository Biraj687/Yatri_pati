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

function App() {
  return (
    <BrowserRouter basename="/dashboard">
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/news" element={<DashboardLayout><NewsManagementPage /></DashboardLayout>} />
          <Route path="/files" element={<DashboardLayout><FileManagerPage /></DashboardLayout>} />
          <Route path="/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
