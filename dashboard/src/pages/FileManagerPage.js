import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDashboard } from '@context';
import { FileManager } from '@components';
import { Alert, LoadingSpinner } from '@components';
export function FileManagerPage() {
    const { files, loading, error, loadFiles, uploadFile, deleteFile, clearError } = useDashboard();
    useEffect(() => {
        loadFiles();
    }, [loadFiles]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "File Manager" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage all uploaded media and files" })] }), error && _jsx(Alert, { type: "error", message: error, onClose: clearError }), loading && !files.length ? (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx(LoadingSpinner, {}) })) : (_jsx(FileManager, { files: files, onUpload: uploadFile, onDelete: deleteFile, loading: loading }))] }));
}
