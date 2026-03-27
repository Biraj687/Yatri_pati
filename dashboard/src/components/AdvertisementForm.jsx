/**
 * AdvertisementForm Component
 * Form for creating and editing advertisements with all required fields
 */

import React, { useState, useEffect } from 'react';
import { Input, TextArea, Button } from './UI';

// Advertisement placement options
const PLACEMENT_OPTIONS = [
  { id: 'hero', label: 'Hero Section (Top)', description: 'Large banner at the top of pages' },
  { id: 'sidebar', label: 'Sidebar', description: 'Side column ad space' },
  { id: 'inline', label: 'Inline (Between Articles)', description: 'Ad between news articles' },
  { id: 'footer', label: 'Footer', description: 'Advertisement in footer' },
  { id: 'fullwidth', label: 'Full Width', description: 'Full width banner' },
  { id: 'trending', label: 'Trending Section', description: 'In trending/popular section' },
  { id: 'modal', label: 'Modal/Popup', description: 'Pop-up advertisement' },
];

// Advertisement type options
const AD_TYPE_OPTIONS = [
  'Image',
  'Video',
  'HTML/Script',
  'Direct Link',
  'Native Ad'
];

export const AdvertisementForm = ({
  initialData,
  onSubmitSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    placement: [],
    adType: 'Image',
    isActive: true,
    startDate: '',
    endDate: '',
    targetAudience: '',
    impressionLimit: '',
    clickLimit: '',
    altText: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        linkUrl: initialData.linkUrl || '',
        placement: initialData.placement || [],
        adType: initialData.adType || 'Image',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        targetAudience: initialData.targetAudience || '',
        impressionLimit: initialData.impressionLimit || '',
        clickLimit: initialData.clickLimit || '',
        altText: initialData.altText || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePlacementToggle = (placementId) => {
    setFormData(prev => ({
      ...prev,
      placement: prev.placement.includes(placementId)
        ? prev.placement.filter(id => id !== placementId)
        : [...prev.placement, placementId]
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.imageUrl.trim()) errors.imageUrl = 'Image URL is required';
    if (!formData.linkUrl.trim()) errors.linkUrl = 'Link URL is required';
    if (formData.placement.length === 0) errors.placement = 'At least one placement location is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.dates = 'End date must be after start date';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      console.log('Saving advertisement:', formData);
      
      // In real implementation, this would call the API
      setSuccess(true);
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save advertisement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✓ Advertisement saved successfully!
        </div>
      )}

      {/* Title & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Advertisement title"
          />
          {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type *</label>
          <select
            name="adType"
            value={formData.adType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AD_TYPE_OPTIONS.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional description for this advertisement"
          rows={3}
        />
      </div>

      {/* Image & Alt Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="https://example.com/image.jpg"
          />
          {validationErrors.imageUrl && <p className="text-red-500 text-xs mt-1">{validationErrors.imageUrl}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
          <input
            type="text"
            name="altText"
            value={formData.altText}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Alternative text for image"
          />
        </div>
      </div>

      {/* Link URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link URL *</label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.linkUrl ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="https://example.com"
        />
        {validationErrors.linkUrl && <p className="text-red-500 text-xs mt-1">{validationErrors.linkUrl}</p>}
      </div>

      {/* Placement Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Placement Locations * (Select at least one)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PLACEMENT_OPTIONS.map(placement => (
            <label key={placement.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.placement.includes(placement.id)}
                onChange={() => handlePlacementToggle(placement.id)}
                className="mt-1 w-4 h-4 border border-gray-300 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">{placement.label}</p>
                <p className="text-xs text-gray-600">{placement.description}</p>
              </div>
            </label>
          ))}
        </div>
        {validationErrors.placement && <p className="text-red-500 text-xs mt-2">{validationErrors.placement}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {validationErrors.startDate && <p className="text-red-500 text-xs mt-1">{validationErrors.startDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {validationErrors.endDate && <p className="text-red-500 text-xs mt-1">{validationErrors.endDate}</p>}
        </div>
      </div>
      {validationErrors.dates && <p className="text-red-500 text-xs">{validationErrors.dates}</p>}

      {/* Limits & Targeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Impression Limit (Optional)</label>
          <input
            type="number"
            name="impressionLimit"
            value={formData.impressionLimit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max impressions"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Click Limit (Optional)</label>
          <input
            type="number"
            name="clickLimit"
            value={formData.clickLimit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max clicks"
            min="0"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience (Optional)</label>
        <input
          type="text"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Tourists, News Readers, Nepal Visitors"
        />
      </div>

      {/* Active Toggle */}
      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 border border-gray-300 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Activate this advertisement</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Advertisement' : 'Create Advertisement'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

