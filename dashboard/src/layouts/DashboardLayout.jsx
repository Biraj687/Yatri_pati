import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiFileText, FiFolder, FiBarChart2, FiSettings, FiLogOut, FiTag, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '@context/AuthContext';



export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: FiHome, requiredRole: [] },
    { label: 'News', path: '/news', icon: FiFileText, requiredRole: ['admin', 'editor'] },
    { label: 'Categories', path: '/categories', icon: FiTag, requiredRole: ['admin', 'editor'] },
    { label: 'Advertisements', path: '/advertisements', icon: FiShoppingCart, requiredRole: 'admin' },
    { label: 'File Manager', path: '/files', icon: FiFolder, requiredRole: 'admin' },
    { label: 'Analytics', path: '/analytics', icon: FiBarChart2, requiredRole: 'admin' },
    { label: 'Settings', path: '/settings', icon: FiSettings, requiredRole: 'admin' },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-blue-600">Yatripati</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-blue-600">
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {visibleMenuItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              title={!sidebarOpen ? label : ''}
            >
              <Icon size={20} />
              {sidebarOpen && {label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FiLogOut size={20} />
            {sidebarOpen && Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-xs font-semibold text-blue-600">{user.name.charAt(0).toUpperCase()}</span>
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

