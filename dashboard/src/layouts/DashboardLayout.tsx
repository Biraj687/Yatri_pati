import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiFileText, FiFolder, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'News', path: '/dashboard/news', icon: FiFileText },
    { label: 'File Manager', path: '/dashboard/files', icon: FiFolder },
    { label: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
    { label: 'Settings', path: '/dashboard/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-primary">Yatripati</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-primary">
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              title={!sidebarOpen ? label : ''}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" title={!sidebarOpen ? 'Logout' : ''}>
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">News Management Dashboard</h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
