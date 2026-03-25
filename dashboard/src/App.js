import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '@context/DashboardContext';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { DashboardHome, NewsManagementPage, FileManagerPage, AnalyticsPage, SettingsPage, } from '@pages';
function App() {
    return (_jsx(BrowserRouter, { basename: "/dashboard", children: _jsx(DashboardProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardLayout, { children: _jsx(DashboardHome, {}) }) }), _jsx(Route, { path: "/news", element: _jsx(DashboardLayout, { children: _jsx(NewsManagementPage, {}) }) }), _jsx(Route, { path: "/files", element: _jsx(DashboardLayout, { children: _jsx(FileManagerPage, {}) }) }), _jsx(Route, { path: "/analytics", element: _jsx(DashboardLayout, { children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(DashboardLayout, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
