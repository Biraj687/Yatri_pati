/**
 * CategoryManagementPage
 * Dashboard page for managing news and content categories
 */

import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useDashboard } from '@context/DashboardContext';
import { Button, Modal, Alert, LoadingSpinner, Input } from '@components/UI';
import { CategoryList } from '@components/CategoryList';
import { CategoryEditor } from '@components/CategoryEditor';

export function CategoryManagementPage() {
  const {
    categories,
    loading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    toggleCategoryStatus,
    clearError,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [sortBy, setSortBy] = useState('order'); // order, name, status

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredAndSorted = categories
    .filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return b.isActive - a.isActive || a.order - b.order;
        case 'order':
        default:
          return a.order - b.order;
      }
    });

  const handleCreateNew = () => {
    setSelectedCategory(undefined);
    setSaveError(null);
    setSaveSuccess(false);
    setShowEditor(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setSaveError(null);
    setSaveSuccess(false);
    setShowEditor(true);
  };

  const handleSave = async (payload) => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (selectedCategory?.id) {
        await updateCategory(selectedCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setShowEditor(false);
        setTimeout(() => setSaveSuccess(false), 2000);
      }, 1500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleCategoryStatus(id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to toggle category status');
    }
  };

  const handleReorder = async (orderedIds) => {
    try {
      await reorderCategories(orderedIds);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to reorder categories');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 text-sm mt-2">
            Manage news categories and organize your content
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateNew}
          className="gap-2 w-full sm:w-auto"
        >
          <FiPlus size={20} />
          New Category
        </Button>
      </div>

      {/* Error Alert */}
      {(error || saveError) && (
        <Alert variant="error" title="Error" onClose={clearError}>
          {error || saveError}
        </Alert>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <Alert variant="success" title="Success">
          Category {selectedCategory ? 'updated' : 'created'} successfully!
        </Alert>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="order">Sort by Order</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
        <p className="text-sm text-gray-600">
          {filteredAndSorted.length} of {categories.length} categories
        </p>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">
              {categories.length === 0 ? 'No categories yet. Create one to get started!' : 'No categories match your search.'}
            </p>
          </div>
        ) : (
          <CategoryList
            categories={filteredAndSorted}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onReorder={handleReorder}
          />
        )}
      </div>

      {/* Category Editor Modal */}
      {showEditor && (
        <Modal
          isOpen={showEditor}
          title={selectedCategory ? 'Edit Category' : 'Create New Category'}
          onClose={() => setShowEditor(false)}
          size="md"
        >
          <CategoryEditor
            initialData={selectedCategory}
            onSave={handleSave}
            onCancel={() => setShowEditor(false)}
            isLoading={loading}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          title="Delete Category"
          onClose={() => setShowDeleteConfirm(false)}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={confirmDelete}
                className="flex-1"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CategoryManagementPage;
