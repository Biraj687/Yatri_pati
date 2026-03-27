import React, { useState, useRef } from 'react';
import { FiTrash2, FiDownload, FiCopy } from 'react-icons/fi';
import type { FileItem } from '@types';
import { formatFileSize, formatDate, getFileIcon, isImage, isVideo } from '@utils';
import { Button, Input } from './UI';



export function FileManager({ files, onUpload, onDelete, onSelect, loading, selectable = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos' | 'documents'>('all');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
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
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
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

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={(e) => {
            Array.from(e.target.files || []).forEach(file => {
              handleFileUpload(file);
            });
          }}
        />
        <div className="text-5xl mb-4">📁</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Drop files here or click to upload</h3>
        <p className="text-gray-600 text-sm">Support for images, videos, and documents</p>
        <Button className="mt-4" variant="primary" disabled={uploading || loading}>
          {uploading ? 'Uploading...' : 'Choose Files'}
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value )}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
            <option value="documents">Documents</option>
          </select>
        </div>
      </div>

      {/* File Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          {searchTerm || filterType !== 'all' ? 'No files found' : 'No files uploaded yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 ${
                selectable ? 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all' : ''
              }`}
              onClick={() => selectable && onSelect?.(file)}
            >
              {/* Preview */}
              <div className="mb-3 bg-gray-100 rounded-lg overflow-hidden h-32 flex items-center justify-center">
                {isImage(file.type) ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : isVideo(file.type) ? (
                  <div className="text-4xl">🎬</div>
                ) : (
                  <div className="text-4xl">{getFileIcon(file.type)}</div>
                )}
              </div>

              {/* Info */}
              <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{file.name}</h4>
              <p className="text-xs text-gray-500 mb-3">
                {formatFileSize(file.size)} • {formatDate(file.createdAt)}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(file.url, file.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors"
                  title="Copy URL"
                >
                  <FiCopy size={14} />
                  {copiedId === file.id ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={file.url}
                  download={file.name}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium transition-colors"
                  title="Download"
                >
                  <FiDownload size={14} />
                  Download
                </a>
                <button
                  onClick={() => onDelete(file.id)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded text-xs font-medium transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {files.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-sm text-blue-800">
          {filteredFiles.length}</strong> of {files.length}</strong> files shown
          {' '}
          •
          
            {(filteredFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}MB
          </strong>
          total
        </div>
      )}
    </div>
  );
}

// Compact version for selecting media in editor
export function MediaSelector({ onSelect: _onSelect }: { onSelect: (file) => void }) {
  // This would be integrated with FileManager in a modal
  return Media Selector Component</div>;
}

