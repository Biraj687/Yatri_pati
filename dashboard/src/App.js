import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { AuthProvider } from '@context/AuthContext';
import { NotificationProvider } from '@context/NotificationContext';
import { DashboardProvider } from '@context/DashboardContext';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { DashboardHome, NewsManagementPage, FileManagerPage, AnalyticsPage, SettingsPage, AdvertisementManagementPage, } from '@pages';
import { appConfig } from './config';
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardLayout, { children: _jsx(DashboardHome, {}) }) }), _jsx(Route, { path: "/news", element: _jsx(DashboardLayout, { children: _jsx(NewsManagementPage, {}) }) }), _jsx(Route, { path: "/files", element: _jsx(DashboardLayout, { children: _jsx(FileManagerPage, {}) }) }), _jsx(Route, { path: "/analytics", element: _jsx(DashboardLayout, { children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(DashboardLayout, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/advertisements", element: _jsx(DashboardLayout, { children: _jsx(AdvertisementManagementPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
function App() {
    const basename = import.meta.env.DEV ? '/' : appConfig.dashboardBasePath;
    return (_jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { basename: basename, children: _jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(DashboardProvider, { children: _jsx(AppRoutes, {}) }) }) }) }) }));
}
export default App;
