import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
export function ProtectedRoute({ children, requiredRole, }) {
    const { isAuthenticated, loading, user } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRole && !user?.role) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user?.role || '')) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Access Denied" }), _jsx("p", { className: "text-gray-600 mt-2", children: "You don't have permission to access this page." })] }) }));
        }
    }
    return _jsx(_Fragment, { children: children });
}
