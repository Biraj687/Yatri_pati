import { useEffect } from 'react';
import { useDashboard } from '@context';
import { FileManager } from '@components';
import { Alert, LoadingSpinner } from '@components';

export function FileManagerPage() {
  const { files, loading, error, loadFiles, uploadFile, deleteFile, clearError } = useDashboard();

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
        <p className="text-gray-600 mt-1">Manage all uploaded media and files</p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {/* File Manager */}
      {loading && !files.length ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <FileManager
          files={files}
          onUpload={uploadFile}
          onDelete={deleteFile}
          loading={loading}
        />
      )}
    </div>
  );
}
