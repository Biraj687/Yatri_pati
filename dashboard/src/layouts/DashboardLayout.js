import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiFileText, FiFolder, FiBarChart2, FiSettings, FiLogOut, FiAward } from 'react-icons/fi';
import { useAuth } from '@context/AuthContext';
export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, hasRole } = useAuth();
    const isActive = (path) => location.pathname === path;
    const menuItems = [
        { label: 'Dashboard', path: '/', icon: FiHome, requiredRole: null },
        { label: 'News', path: '/news', icon: FiFileText, requiredRole: ['admin', 'editor'] },
        { label: 'Advertisements', path: '/advertisements', icon: FiAward, requiredRole: 'admin' },
        { label: 'File Manager', path: '/files', icon: FiFolder, requiredRole: 'admin' },
        { label: 'Analytics', path: '/analytics', icon: FiBarChart2, requiredRole: 'admin' },
        { label: 'Settings', path: '/settings', icon: FiSettings, requiredRole: 'admin' },
    ];
    const visibleMenuItems = menuItems.filter(item => {
        if (!item.requiredRole)
            return true;
        return hasRole(item.requiredRole);
    });
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("aside", { className: `${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col overflow-hidden`, children: [_jsxs("div", { className: "p-6 flex items-center justify-between", children: [sidebarOpen && _jsx("h1", { className: "text-xl font-bold text-blue-600", children: "Yatripati" }), _jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "text-gray-600 hover:text-blue-600", children: sidebarOpen ? _jsx(FiX, { size: 24 }) : _jsx(FiMenu, { size: 24 }) })] }), _jsx("nav", { className: "flex-1 px-3 space-y-2 overflow-y-auto", children: visibleMenuItems.map(({ label, path, icon: Icon }) => (_jsxs(Link, { to: path, className: `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `, title: !sidebarOpen ? label : '', children: [_jsx(Icon, { size: 20 }), sidebarOpen && _jsx("span", { children: label })] }, path))) }), _jsx("div", { className: "border-t border-gray-200 p-3", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors", title: !sidebarOpen ? 'Logout' : '', children: [_jsx(FiLogOut, { size: 20 }), sidebarOpen && _jsx("span", { children: "Logout" })] }) })] }), _jsxs("main", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-white border-b border-gray-200 shadow-sm p-6 flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }), _jsxs("div", { className: "flex items-center gap-4", children: [user && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user.name }), _jsx("p", { className: "text-xs text-gray-500", children: user.role })] }), _jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full", children: _jsx("span", { className: "text-xs font-semibold text-blue-600", children: user.name.charAt(0).toUpperCase() }) })] })), _jsx("div", { className: "text-sm text-gray-600", children: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })] })] }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: children })] })] }));
}
