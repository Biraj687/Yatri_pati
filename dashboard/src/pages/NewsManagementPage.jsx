import { useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useDashboard } from '@context/DashboardContext';
import { NewsList, NewsEditor, Button, Modal, Alert, LoadingSpinner, Input } from '@components';

export function NewsManagementPage() {
  const {
    articles,
    categories,
    loading,
    error,
    loadArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    toggleSticky,
    clearError,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedArticle, setSelectedArticle] = useState();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Simple debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadArticles();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, loadArticles]);

  const filteredAndSorted = [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-viewed':
        return (b.views || 0) - (a.views || 0);
      case 'rank':
        return (b.rank || 0) - (a.rank || 0);
      default:
        return 0;
    }
  });

  const handleCreateNew = () => {
    setSelectedArticle(undefined);
    setSaveError(null);
    setSaveSuccess(false);
    setShowEditor(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setSaveError(null);
    setSaveSuccess(false);
    setShowEditor(true);
  };

  const handleSave = async (payload) => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (selectedArticle?.id) {
        await updateArticle(selectedArticle.id, payload);
      } else {
        await createArticle(payload);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setShowEditor(false);
        setTimeout(() => setSaveSuccess(false), 2000);
      }, 1500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArticle(deleteTarget);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to delete article');
    }
  };

  const publishDraft = async (id) => {
    try {
      await publishArticle(id);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to publish article');
    }
  };

  const toggleArticleSticky = async (id) => {
    try {
      await toggleSticky(id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update sticky status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage all your news articles and content</p>
        </div>
        <Button variant="primary" onClick={handleCreateNew} className="gap-2 w-full sm:w-auto">
          <FiPlus size={20} />
          New Article
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={clearError} />}
      {saveError && <Alert type="error" message={saveError} onClose={() => setSaveError(null)} />}
      {saveSuccess && <Alert type="success" message="Article saved successfully!" onClose={() => setSaveSuccess(false)} dismissible={false} />}

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              placeholder="Search articles..."
              icon={<FiSearch size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 pr-5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-colors hover:border-gray-400"
              >
                <option value="all">All Status</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <div className="pointer-events-none absolute right-1.5 top-2.5 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 pr-5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-colors hover:border-gray-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="rank">By Rank</option>
              </select>
              <div className="pointer-events-none absolute right-1.5 top-2.5 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List or Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <NewsList
          articles={filteredAndSorted}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleSticky={toggleArticleSticky}
          onPublish={publishDraft}
          loading={loading}
          onRowClick={handleEdit}
        />
      )}

      {/* Editor Modal */}
      <Modal
        isOpen={showEditor}
        title={selectedArticle ? 'Edit Article' : 'Create New Article'}
        onClose={() => {
          setShowEditor(false);
          setSelectedArticle(undefined);
          setSaveError(null);
          setSaveSuccess(false);
        }}
        size="xl"
      >
        {saveSuccess ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-lg font-semibold text-gray-900">
              Article {selectedArticle ? 'updated' : 'created'} successfully
            </p>
          </div>
        ) : (
          <NewsEditor
            article={selectedArticle}
            onSave={handleSave}
            onCancel={() => setShowEditor(false)}
            loading={loading}
            categories={categories.filter(c => c.isActive).map(c => c.name)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title="Delete Article"
        onClose={() => setShowDeleteConfirm(false)}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={loading}>
              Delete Article
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-gray-900 font-semibold mb-2">Are you sure?</p>
          <p className="text-gray-600 text-sm">
            This action cannot be undone. The article will be permanently deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}

