import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FileManager Page - File upload, download, and management
 */
import { useState, useCallback } from 'react';
import { useDashboard } from '@context/DashboardContext';
import { useNotification } from '@context/NotificationContext';
import { uploadFileSchema } from '@utils/validation';
import { FiDownload, FiTrash2, FiUpload } from 'react-icons/fi';
export function FileManagerPage() {
    const { files, loading, uploadFile, deleteFile } = useDashboard();
    const { showNotification } = useNotification();
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const handleFileUpload = useCallback(async (event) => {
        const fileList = event.target.files;
        if (!fileList)
            return;
        setUploading(true);
        const file = fileList[0];
        try {
            // Validate file
            const data = { file };
            await uploadFileSchema.parseAsync(data);
            // Upload file
            await uploadFile(file);
            showNotification(`File "${file.name}" uploaded successfully!`, 'success');
            event.target.value = '';
        }
        catch (error) {
            showNotification(error instanceof Error ? error.message : 'Failed to upload file', 'error');
        }
        finally {
            setUploading(false);
        }
    }, [uploadFile, showNotification]);
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to delete this file?'))
            return;
        try {
            await deleteFile(id);
            showNotification('File deleted successfully!', 'success');
        }
        catch (error) {
            showNotification(error.message, 'error');
        }
    }, [deleteFile, showNotification]);
    const handleBulkDelete = useCallback(async () => {
        if (selectedFiles.length === 0)
            return;
        if (!window.confirm(`Delete ${selectedFiles.length} file(s)?`))
            return;
        try {
            for (const id of selectedFiles) {
                await deleteFile(id);
            }
            setSelectedFiles([]);
            showNotification('Files deleted successfully!', 'success');
        }
        catch (error) {
            showNotification(error.message, 'error');
        }
    }, [selectedFiles, deleteFile, showNotification]);
    const toggleSelect = (id) => {
        setSelectedFiles(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };
    const toggleSelectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([]);
        }
        else {
            setSelectedFiles(files.map(f => f.id));
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "File Manager" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Upload, manage, and organize your files" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Upload Files" }), _jsxs("label", { className: "flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition", children: [_jsxs("div", { className: "text-center", children: [_jsx(FiUpload, { className: "mx-auto text-gray-400 mb-2", size: 32 }), _jsx("p", { className: "text-gray-700 font-medium", children: "Click to upload or drag and drop" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "PNG, JPG, GIF, PDF or CSV (max. 10MB)" })] }), _jsx("input", { type: "file", className: "hidden", onChange: handleFileUpload, disabled: uploading, accept: "image/jpeg,image/png,image/gif,application/pdf,text/csv" })] }), uploading && _jsx("p", { className: "text-blue-600 text-sm mt-2", children: "Uploading..." })] }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Files (", files.length, ")"] }), selectedFiles.length > 0 && (_jsxs("button", { onClick: handleBulkDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm", children: ["Delete (", selectedFiles.length, ")"] }))] }), files.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: _jsx("p", { children: "No files yet. Upload one to get started!" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left", children: _jsx("input", { type: "checkbox", checked: selectedFiles.length === files.length && files.length > 0, onChange: toggleSelectAll, className: "rounded" }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Size" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Uploaded" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: files.map(file => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "checkbox", checked: selectedFiles.includes(file.id), onChange: () => toggleSelect(file.id), className: "rounded" }) }), _jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: file.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: formatFileSize(file.size) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: file.type }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(file.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("a", { href: file.url, download: file.name, className: "text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-gray-100", title: "Download", children: _jsx(FiDownload, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(file.id), className: "text-red-600 hover:text-red-700 p-2 rounded hover:bg-gray-100", title: "Delete", children: _jsx(FiTrash2, { size: 16 }) })] }) })] }, file.id))) })] }) }))] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "Storage Information" }), _jsxs("div", { className: "space-y-2 text-sm text-blue-800", children: [_jsxs("p", { children: ["Total files: ", _jsx("strong", { children: files.length })] }), _jsxs("p", { children: ["Total size: ", _jsx("strong", { children: formatFileSize(files.reduce((sum, f) => sum + f.size, 0)) })] }), _jsxs("p", { children: ["Max file size: ", _jsx("strong", { children: "10 MB" })] })] })] })] }));
}
