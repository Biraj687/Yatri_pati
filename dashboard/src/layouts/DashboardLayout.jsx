  import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiFileText, FiBarChart2, FiSettings, FiLogOut, FiTag, FiShoppingCart, FiLayout, FiImage, FiGlobe, FiSliders, FiEye } from 'react-icons/fi';
import { useAuth } from '@context/AuthContext';



export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Master Control', path: '/control-panel', icon: FiSliders, requiredRole: 'admin', highlight: true },
    { label: 'Live Preview', path: '/preview', icon: FiEye, requiredRole: 'admin', highlight: true },
    { label: 'Dashboard', path: '', icon: null, divider: true },
    { label: 'Overview', path: '/', icon: FiHome, requiredRole: [] },
    { label: 'News', path: '/news', icon: FiFileText, requiredRole: ['admin', 'editor'] },
    { label: 'Categories', path: '/categories', icon: FiTag, requiredRole: ['admin', 'editor'] },
    { label: 'Advertisements', path: '/advertisements', icon: FiShoppingCart, requiredRole: 'admin' },
    // Comprehensive Dashboard Section
    { label: 'Content Management', path: '', icon: null, divider: true },
    { label: 'Content Control', path: '/content-control', icon: FiLayout, requiredRole: 'admin' },
    { label: 'Banner Management', path: '/banners', icon: FiImage, requiredRole: 'admin' },
    { label: 'Site Settings', path: '/site-settings', icon: FiGlobe, requiredRole: 'admin' },
    // Analytics & Settings Section
    { label: 'Analytics & Settings', path: '', icon: null, divider: true },
    { label: 'Analytics', path: '/analytics', icon: FiBarChart2, requiredRole: 'admin' },
    { label: 'Settings', path: '/settings', icon: FiSettings, requiredRole: 'admin' },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (item.divider) return sidebarOpen; // Only show dividers when sidebar is open
    if (!item.requiredRole || (Array.isArray(item.requiredRole) && item.requiredRole.length === 0)) return true;
    return hasRole(item.requiredRole);
  });

  const currentPageTitle =
    menuItems.find(item => !item.divider && isActive(item.path))?.label || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#ea0031]">Nepal Explain</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-[#ea0031]">
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {visibleMenuItems.map(({ label, path, icon: Icon, divider, highlight }) => {
            if (divider) {
              return (
                <div key={label} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {label}
                </div>
              );
            }
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    highlight
                      ? isActive(path)
                        ? 'bg-gradient-to-r from-red-600 to-[#ea0031] text-white font-bold shadow-lg'
                          : 'bg-gradient-to-r from-red-500 to-[#ea0031] text-white font-bold shadow-md hover:from-red-600 hover:to-[#c9002a]'
                      : isActive(path)
                        ? 'bg-red-50 text-[#ea0031] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={!sidebarOpen ? label : ''}
              >
                {Icon && <Icon size={20} />}
                {sidebarOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#ea0031]">{currentPageTitle}</h2>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-[#ea0031] rounded-full">
                  <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

