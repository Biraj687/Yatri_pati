/**
 * CategoryEditor Component
 * Form for creating and editing categories
 */

import React, { useState, useEffect } from 'react';
import { Button } from './UI';

// Function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export function CategoryEditor({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Auto-generate slug from name if editing name field
    if (name === 'name' && !initialData) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(newValue),
      }));
    }
  };

  const handleAutoGenerateSlug = () => {
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(formData.name),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }

    setIsValidating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Politics, Tourism, Technology"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">Maximum 100 characters</p>
      </div>

      {/* Slug */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Slug *
          </label>
          <button
            type="button"
            onClick={handleAutoGenerateSlug}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            Auto-generate
          </button>
        </div>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="e.g., politics, tourism, technology"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.slug ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.slug && (
          <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
          disabled={isLoading}
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
          Active Category
        </label>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          formData.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {formData.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isValidating}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
