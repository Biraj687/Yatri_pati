/**
 * AdvertisementForm Component
 * Enhanced form for creating and editing advertisements with file upload, preview, and validation
 */

import React, { useState, useEffect } from 'react';
import { Button } from './UI';
import { FiUpload, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
    altText: '',
    targetAudience: '',
    maxImpressions: '',
    maxClicks: '',
    budget: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const PLACEMENTS = ['Hero', 'Sidebar', 'Inline', 'Footer', 'Full Width', 'Trending', 'Modal', 'Popup'];
  const AD_TYPES = ['Image', 'Video', 'HTML/Script', 'Direct Link', 'Native Ad', 'Banner'];
  const TARGET_AUDIENCE = ['All', 'Politics Readers', 'Tourism Seekers', 'Tech Enthusiasts', 'Business', 'Entertainment', 'Sports Fans'];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Invalid URL format';
      }
    }
    if (!formData.linkUrl.trim()) {
      newErrors.linkUrl = 'Link URL is required';
    } else {
      try {
        new URL(formData.linkUrl);
      } catch {
        newErrors.linkUrl = 'Invalid URL format';
      }
    }
    if (formData.placement.length === 0) {
      newErrors.placement = 'Select at least one placement';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dates = 'End date must be after start date';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePlacementToggle = (placement) => {
    setFormData(prev => ({
      ...prev,
      placement: prev.placement.includes(placement)
        ? prev.placement.filter(p => p !== placement)
        : [...prev.placement, placement]
    }));
    if (validationErrors.placement) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.placement;
        return newErrors;
      });
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
    }));
    // Update preview
    if (url) {
      setImagePreview(url);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setImagePreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      console.log('Form submitted:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      {/* Error Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start">
          <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-green-700">Advertisement saved successfully!</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5 col-span-2 lg:col-span-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                validationErrors.title
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Catchy ad title"
              required
            />
            {validationErrors.title && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Describe your advertisement (optional)"
            />
          </div>

          {/* Ad Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Type *</label>
            <select
              name="adType"
              value={formData.adType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {AD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text</label>
            <input
              type="text"
              name="altText"
              value={formData.altText}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Image alt text for accessibility"
            />
          </div>
        </div>

        {/* Right Column - Image Preview */}
        <div className="space-y-5 col-span-2 lg:col-span-1">
          {/* Image Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
            {imagePreview ? (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImagePreview(null)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition">
                <FiUpload size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">No image selected</p>
              </div>
            )}
          </div>

          {/* Upload File Button */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* URL Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleImageUrlChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              validationErrors.imageUrl
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {validationErrors.imageUrl && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.imageUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Link URL *</label>
          <input
            type="url"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              validationErrors.linkUrl
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="https://example.com"
          />
          {validationErrors.linkUrl && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.linkUrl}</p>
          )}
        </div>
      </div>

      {/* Placements */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Placements *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLACEMENTS.map(p => (
            <label key={p} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
              <input
                type="checkbox"
                checked={formData.placement.includes(p)}
                onChange={() => handlePlacementToggle(p)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">{p}</span>
            </label>
          ))}
        </div>
        {validationErrors.placement && (
          <p className="text-red-600 text-sm mt-2">{validationErrors.placement}</p>
        )}
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
        <select
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select audience</option>
          {TARGET_AUDIENCE.map(audience => (
            <option key={audience} value={audience}>{audience}</option>
          ))}
        </select>
      </div>

      {/* Date Range and Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              validationErrors.dates
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {validationErrors.dates && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.dates}</p>
          )}
        </div>
      </div>

      {/* Campaign Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Max Impressions</label>
          <input
            type="number"
            name="maxImpressions"
            value={formData.maxImpressions}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Unlimited if empty"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Max Clicks</label>
          <input
            type="number"
            name="maxClicks"
            value={formData.maxClicks}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Unlimited if empty"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Budget amount"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2"
        />
        <label className="flex-1 font-medium text-gray-700">
          Active Advertisement
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData ? 'Update Advertisement' : 'Create Advertisement'}
        </Button>
      </div>
    </form>
  );
};

export default AdvertisementForm;
                checked={formData.placement.includes(p)}
                onChange={() => handlePlacementToggle(p)}
                className="w-4 h-4 border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{p}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 border border-gray-300 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Active</span>
      </label>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : 'Save Advertisement'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

