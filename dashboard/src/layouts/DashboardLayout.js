import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiFileText, FiFolder, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const menuItems = [
        { label: 'Dashboard', path: '/', icon: FiHome },
        { label: 'News', path: '/news', icon: FiFileText },
        { label: 'File Manager', path: '/files', icon: FiFolder },
        { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
        { label: 'Settings', path: '/settings', icon: FiSettings },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("aside", { className: `${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col overflow-hidden`, children: [_jsxs("div", { className: "p-6 flex items-center justify-between", children: [sidebarOpen && _jsx("h1", { className: "text-xl font-bold text-primary", children: "Yatripati" }), _jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "text-gray-600 hover:text-primary", children: sidebarOpen ? _jsx(FiX, { size: 24 }) : _jsx(FiMenu, { size: 24 }) })] }), _jsx("nav", { className: "flex-1 px-3 space-y-2 overflow-y-auto", children: menuItems.map(({ label, path, icon: Icon }) => (_jsxs(Link, { to: path, className: `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                ? 'bg-blue-50 text-primary font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `, title: !sidebarOpen ? label : '', children: [_jsx(Icon, { size: 20 }), sidebarOpen && _jsx("span", { children: label })] }, path))) }), _jsx("div", { className: "border-t border-gray-200 p-3", children: _jsxs("button", { className: "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors", title: !sidebarOpen ? 'Logout' : '', children: [_jsx(FiLogOut, { size: 20 }), sidebarOpen && _jsx("span", { children: "Logout" })] }) })] }), _jsxs("main", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-white border-b border-gray-200 shadow-sm p-6 flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "News Management Dashboard" }), _jsx("div", { className: "text-sm text-gray-600", children: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })] }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: children })] })] }));
}
