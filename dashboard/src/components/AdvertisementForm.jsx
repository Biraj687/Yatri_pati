/**
 * AdvertisementForm Component
 * Form for creating and editing advertisements
 */

import React, { useState } from 'react';
import type { Advertisement, CreateAdvPayload } from '@shared/types';
import { advertisementService } from '@shared/services';



export const AdvertisementForm: React.FC = ({
  initialData,
  onSubmitSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title.title || '',
    description.description || '',
    imageUrl.imageUrl || '',
    linkUrl.linkUrl || '',
    position.position || 'inline',
    isActive.isActive !== undefined ? initialData.isActive ,
    startDate.startDate || '',
    endDate.endDate || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target ).checked ,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let response;

      if (initialData?.id) {
        // Update existing
        response = await advertisementService.updateAdvertisement(initialData.id, {
          ...formData,
          id: initialData.id,
        });
      } else {
        // Create new
        response = await advertisementService.createAdvertisement(formData);
      }

      if (response.success) {
        onSubmitSuccess?.();
      } else {
        setError(response.error || 'Failed to save advertisement');
      }
    } catch (err) {
      setError((err ).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Advertisement title"
        />
      </div>

      {/* Description */}
      
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description"
        />
      </div>

      {/* Image URL */}
      
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Link URL */}
      
        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL *</label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      {/* Position */}
      
        <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="hero">Hero Section</option>
          <option value="sidebar">Sidebar</option>
          <option value="inline">Inline (Between Articles)</option>
          <option value="footer">Footer</option>
          <option value="fullwidth">Full Width</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Active Status */}
      
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive || false}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...'  'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

