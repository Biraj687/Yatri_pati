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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList) return;

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
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : 'Failed to upload file',
          'error'
        );
      } finally {
        setUploading(false);
      }
    },
    [uploadFile, showNotification]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this file?')) return;

      try {
        await deleteFile(id);
        showNotification('File deleted successfully!', 'success');
      } catch (error) {
        showNotification((error as Error).message, 'error');
      }
    },
    [deleteFile, showNotification]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    if (!window.confirm(`Delete ${selectedFiles.length} file(s)?`)) return;

    try {
      for (const id of selectedFiles) {
        await deleteFile(id);
      }
      setSelectedFiles([]);
      showNotification('Files deleted successfully!', 'success');
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
  }, [selectedFiles, deleteFile, showNotification]);

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f.id));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
        <p className="text-gray-600 mt-2">Upload, manage, and organize your files</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
        <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <div className="text-center">
            <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF, PDF or CSV (max. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/jpeg,image/png,image/gif,application/pdf,text/csv"
          />
        </label>
        {uploading && <p className="text-blue-600 text-sm mt-2">Uploading...</p>}
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Files ({files.length})</h2>
          {selectedFiles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Delete ({selectedFiles.length})
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No files yet. Upload one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === files.length && files.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map(file => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleSelect(file.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{file.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          download={file.name}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-gray-100"
                          title="Download"
                        >
                          <FiDownload size={16} />
                        </a>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-gray-100"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Storage Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>Total files: <strong>{files.length}</strong></p>
          <p>Total size: <strong>{formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}</strong></p>
          <p>Max file size: <strong>10 MB</strong></p>
        </div>
      </div>
    </div>
  );
}
