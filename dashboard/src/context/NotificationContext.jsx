/**
 * Notification Context - Global toast/notification system
 */

import { createContext, useContext, useState, useCallback } from 'react';







const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message, type, duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, type, message, duration };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

// Notification Display Component
function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}



function NotificationItem({ notification, onClose }) {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[notification.type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[notification.type];

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }[notification.type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  }[notification.type];

  return (
    <div className={`border rounded-lg p-4 shadow-lg ${bgColor}`}>
      <div className="flex items-start gap-3">
        <span className={`text-lg font-bold flex-shrink-0 ${iconColor}`}>
          {icon}
        </span>
        <p className={`flex-1 ${textColor}`}>{notification.message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${textColor} hover:opacity-70`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

