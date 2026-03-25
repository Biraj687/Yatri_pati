import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { FiTrash2, FiDownload, FiCopy } from 'react-icons/fi';
import { formatFileSize, formatDate, getFileIcon, isImage, isVideo } from '@utils';
import { Button, Input } from './UI';
export function FileManager({ files, onUpload, onDelete, onSelect, loading, selectable = false }) {
    const [dragActive, setDragActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            await handleFileUpload(files[i]);
        }
    };
    const handleFileUpload = async (file) => {
        setUploading(true);
        try {
            await onUpload(file);
        }
        catch (error) {
            console.error('Upload failed:', error);
        }
        finally {
            setUploading(false);
        }
    };
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' ||
            (filterType === 'images' && isImage(file.type)) ||
            (filterType === 'videos' && isVideo(file.type)) ||
            (filterType === 'documents' && !isImage(file.type) && !isVideo(file.type));
        return matchesSearch && matchesFilter;
    });
    const copyToClipboard = (url, fileId) => {
        navigator.clipboard.writeText(url);
        setCopiedId(fileId);
        setTimeout(() => setCopiedId(null), 2000);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: `border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`, onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, onClick: () => fileInputRef.current?.click(), children: [_jsx("input", { ref: fileInputRef, type: "file", hidden: true, multiple: true, onChange: (e) => {
                            Array.from(e.target.files || []).forEach(file => {
                                handleFileUpload(file);
                            });
                        } }), _jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCC1" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: "Drop files here or click to upload" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Support for images, videos, and documents" }), _jsx(Button, { className: "mt-4", variant: "primary", disabled: uploading || loading, children: uploading ? 'Uploading...' : 'Choose Files' })] }), _jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-4 space-y-4", children: _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx("div", { className: "flex-1 min-w-64", children: _jsx(Input, { placeholder: "Search files...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Files" }), _jsx("option", { value: "images", children: "Images" }), _jsx("option", { value: "videos", children: "Videos" }), _jsx("option", { value: "documents", children: "Documents" })] })] }) }), filteredFiles.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCED" }), _jsx("p", { children: searchTerm || filterType !== 'all' ? 'No files found' : 'No files uploaded yet' })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredFiles.map(file => (_jsxs("div", { className: `bg-white rounded-lg border border-gray-200 p-4 ${selectable ? 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all' : ''}`, onClick: () => selectable && onSelect?.(file), children: [_jsx("div", { className: "mb-3 bg-gray-100 rounded-lg overflow-hidden h-32 flex items-center justify-center", children: isImage(file.type) ? (_jsx("img", { src: file.url, alt: file.name, className: "w-full h-full object-cover" })) : isVideo(file.type) ? (_jsx("div", { className: "text-4xl", children: "\uD83C\uDFAC" })) : (_jsx("div", { className: "text-4xl", children: getFileIcon(file.type) })) }), _jsx("h4", { className: "font-medium text-gray-900 text-sm mb-1 truncate", children: file.name }), _jsxs("p", { className: "text-xs text-gray-500 mb-3", children: [formatFileSize(file.size), " \u2022 ", formatDate(file.createdAt)] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => copyToClipboard(file.url, file.id), className: "flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors", title: "Copy URL", children: [_jsx(FiCopy, { size: 14 }), copiedId === file.id ? 'Copied!' : 'Copy'] }), _jsxs("a", { href: file.url, download: file.name, className: "flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium transition-colors", title: "Download", children: [_jsx(FiDownload, { size: 14 }), "Download"] }), _jsx("button", { onClick: () => onDelete(file.id), className: "px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded text-xs font-medium transition-colors", title: "Delete", children: _jsx(FiTrash2, { size: 14 }) })] })] }, file.id))) })), files.length > 0 && (_jsxs("div", { className: "bg-blue-50 rounded-lg border border-blue-200 p-4 text-sm text-blue-800", children: [_jsx("strong", { children: filteredFiles.length }), " of ", _jsx("strong", { children: files.length }), " files shown", ' ', "\u2022", _jsxs("strong", { children: [(filteredFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2), "MB"] }), "total"] }))] }));
}
// Compact version for selecting media in editor
export function MediaSelector({ onSelect: _onSelect }) {
    // This would be integrated with FileManager in a modal
    return _jsx("div", { children: "Media Selector Component" });
}
