import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorBoundary Component - Catches React errors and displays fallback UI
 */
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: null });
            }
        });
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (this.props.fallback || (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md p-8 bg-white rounded-lg shadow-lg", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full", children: _jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "mt-4 text-lg font-medium text-center text-gray-900", children: "Something went wrong" }), _jsx("p", { className: "mt-2 text-sm text-center text-gray-500", children: this.state.error?.message || 'An unexpected error occurred' }), _jsx("button", { onClick: this.handleReset, className: "mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", children: "Try again" })] }) })));
        }
        return this.props.children;
    }
}
