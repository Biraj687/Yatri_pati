import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export function Alert({ variant, title, children, onClose, dismissible = true, className = '' }) {
  const getColors = () => {
    switch (variant) {
      case 'error': return 'bg-red-50 text-red-800 border-red-200';
      case 'success': return 'bg-green-50 text-green-800 border-green-200';
      case 'info': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'error': return <FiAlertCircle size={20} />;
      case 'success': return <FiCheckCircle size={20} />;
      case 'info': return <FiInfo size={20} />;
      default: return <FiAlertCircle size={20} />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${getColors()} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div>{children}</div>
      </div>
      {dismissible && onClose && (
        <button onClick={onClose} className="flex-shrink-0 ml-2 hover:opacity-70">
          <FiX size={20} />
        </button>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'primary', size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm';
  const variantClass = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  }[variant];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${sizeClass} ${variantClass} ${
        fullWidth ? 'w-full' : ''
      } disabled:cursor-not-allowed ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
}

export function Input({ label, error, helperText, icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
        <input
          className={`w-full px-3 py-2 ${icon ? 'pl-10' : ''} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

export function TextArea({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}

export function Card({ children, className = '', hoverable = false }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Modal({ isOpen, title, children, onClose, footer, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-2xl ${sizeClass} w-full max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-light w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, defaultValue }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value);

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab.value
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}

export function Skeleton({ width = 'w-full', height = 'h-4', className = '' }) {
  return <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function Select({ label, error, options, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
