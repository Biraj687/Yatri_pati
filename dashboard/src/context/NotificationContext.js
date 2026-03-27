import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Notification Context - Global toast/notification system
 */
import { createContext, useContext, useState, useCallback } from 'react';
const NotificationContext = createContext(undefined);
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const showNotification = useCallback((message, type, duration = 4000) => {
        const id = `${Date.now()}-${Math.random()}`;
        const notification = { id, type, message, duration };
        setNotifications(prev => [...prev, notification]);
        if (duration > 0) {
            setTimeout(() => removeNotification(id), duration);
        }
    }, []);
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);
    return (_jsxs(NotificationContext.Provider, { value: { notifications, showNotification, removeNotification }, children: [children, _jsx(NotificationContainer, {})] }));
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
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: notifications.map(notification => (_jsx(NotificationItem, { notification: notification, onClose: () => removeNotification(notification.id) }, notification.id))) }));
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
    return (_jsx("div", { className: `border rounded-lg p-4 shadow-lg ${bgColor}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: `text-lg font-bold flex-shrink-0 ${iconColor}`, children: icon }), _jsx("p", { className: `flex-1 ${textColor}`, children: notification.message }), _jsx("button", { onClick: onClose, className: `flex-shrink-0 ${textColor} hover:opacity-70`, children: "\u2715" })] }) }));
}
