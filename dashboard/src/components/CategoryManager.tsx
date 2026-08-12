/**
 * Category Manager Component
 * Manage categories: add, edit, delete, reorder, duplicate, toggle visibility
 */

import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiEye, FiEyeOff } from 'react-icons/fi';
import { useEnhancedFrontendControl } from '@context/EnhancedFrontendControlContext';
import './CategoryManager.css';

interface EditingCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    duplicateCategory,
    toggleCategoryVisibility,
    reorderCategories,
  } = useEnhancedFrontendControl();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<EditingCategory>>({
    name: '',
    description: '',
    color: '#FF6B6B',
  });
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);

  // Handle add new category
  const handleAddCategory = () => {
    if (!newCategory.name?.trim()) {
      alert('Category name is required');
      return;
    }

    addCategory({
      name: newCategory.name,
      description: newCategory.description || '',
      color: newCategory.color || '#FF6B6B',
      order: categories.length,
      visible: true,
    });

    setNewCategory({ name: '', description: '', color: '#FF6B6B' });
    setIsAddingNew(false);
  };

  // Handle edit category
  const handleEditStart = (category: typeof categories[0]) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color || '#FF6B6B',
    });
    setEditingId(category.id);
  };

  const handleEditSave = () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      color: editingCategory.color,
    });

    setEditingId(null);
    setEditingCategory(null);
  };

  // Handle drag reorder
  const handleDragStart = (categoryId: string) => {
    setDraggedId(categoryId);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = categories.findIndex((c) => c.id === draggedId);
    const targetIndex = categories.findIndex((c) => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...categories];
    [newOrder[draggedIndex], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[draggedIndex],
    ];

    reorderCategories(newOrder);
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h2>Categories Management</h2>
        <button
          className="btn-primary"
          onClick={() => setIsAddingNew(!isAddingNew)}
        >
          <FiPlus /> {isAddingNew ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className="category-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              placeholder="e.g., समाचार, गन्तव्य"
              value={newCategory.name || ''}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Brief description of this category"
              value={newCategory.description || ''}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              <input
                type="color"
                value={newCategory.color || '#FF6B6B'}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, color: e.target.value })
                }
              />
              <span>{newCategory.color}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-success" onClick={handleAddCategory}>
              Create Category
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsAddingNew(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="categories-list">
        {categories.length === 0 ? (
          <p className="empty-state">No categories yet. Create your first one!</p>
        ) : (
          categories
            .sort((a, b) => a.order - b.order)
            .map((category) => (
              <div
                key={category.id}
                className={`category-card ${draggedId === category.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(category.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(category.id)}
              >
                {/* Drag Handle */}
                <div className="drag-handle">
                  ⋮⋮
                </div>

                {/* Color Indicator */}
                <div
                  className="category-color"
                  style={{ backgroundColor: category.color }}
                />

                {/* Category Info */}
                {editingId === category.id && editingCategory ? (
                  <div className="category-info-edit">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                    />
                    <textarea
                      value={editingCategory.description}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description: e.target.value,
                        })
                      }
                      rows={1}
                    />
                    <div className="color-picker-inline">
                      <input
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            color: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="article-count">
                      {category.articles.length} articles
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="category-actions">
                  {editingId === category.id ? (
                    <>
                      <button
                        className="btn-icon btn-success"
                        onClick={handleEditSave}
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        className="btn-icon btn-secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditingCategory(null);
                        }}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEditStart(category)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon btn-toggle"
                        onClick={() => toggleCategoryVisibility(category.id)}
                        title={category.visible ? 'Hide' : 'Show'}
                      >
                        {category.visible ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button
                        className="btn-icon btn-copy"
                        onClick={() => duplicateCategory(category.id)}
                        title="Duplicate"
                      >
                        <FiCopy />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete "${category.name}" and all its articles?`
                            )
                          ) {
                            deleteCategory(category.id);
                          }
                        }}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>

                {/* Not Visible Badge */}
                {!category.visible && (
                  <div className="visibility-badge">Hidden</div>
                )}
              </div>
            ))
        )}
      </div>

      {/* Quick Reference */}
      <div className="quick-reference">
        <h4>Quick Tips:</h4>
        <ul>
          <li>Drag categories to reorder them</li>
          <li>Click eye icon to show/hide categories on homepage</li>
          <li>Duplicate to quickly create similar categories</li>
          <li>Edit name, description, and color anytime</li>
        </ul>
      </div>
    </div>
  );
}
