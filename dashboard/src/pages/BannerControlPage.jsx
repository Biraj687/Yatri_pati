import { useState, useEffect } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { Button, Alert, Badge, Card } from '@components';

/**
 * Banner Control Page - Manage advertisement banners at different positions
 */
export function BannerControlPage() {
  const [banners, setBanners] = useState(getBannersFromStorage());
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(getEmptyBannerForm());
  const [saveStatus, setSaveStatus] = useState(null);

  const positions = [
    { value: 'top', label: 'Top of Page', description: 'Above the hero section' },
    { value: 'home-after-latest', label: 'After Latest News', description: 'After Samachar section' },
    { value: 'after-trending', label: 'After Trending', description: 'After विशेष सिफारिस' },
    { value: 'after-packages', label: 'After Packages', description: 'After प्याकेज समाचार' },
    { value: 'after-hospitality', label: 'After Hospitality', description: 'After हस्पिटालिटि' },
    { value: 'after-destinations', label: 'After Destinations', description: 'After गन्तव्य' },
    { value: 'before-footer', label: 'Before Footer', description: 'Just above footer' },
    { value: 'sidebar', label: 'Sidebar', description: 'In article sidebar' },
    { value: 'category-top', label: 'Category Top', description: 'Top of category pages' },
    { value: 'article-middle', label: 'Article Middle', description: 'Middle of article content' },
  ];

  const bannerTypes = [
    { value: 'image', label: 'Image Banner' },
    { value: 'video', label: 'Video Banner' },
    { value: 'carousel', label: 'Carousel/Slideshow' },
    { value: 'html', label: 'Custom HTML' },
  ];

  useEffect(() => {
    saveBannersToStorage(banners);
  }, [banners]);

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({ ...banner });
  };

  const handleNew = () => {
    setEditingId('new');
    setFormData(getEmptyBannerForm());
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(getEmptyBannerForm());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.position) {
      setSaveStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    if (editingId === 'new') {
      const newBanner = { ...formData, id: Date.now() };
      setBanners([...banners, newBanner]);
      setSaveStatus({ type: 'success', message: 'Banner created successfully' });
    } else {
      setBanners(banners.map(b => b.id === editingId ? { ...b, ...formData } : b));
      setSaveStatus({ type: 'success', message: 'Banner updated successfully' });
    }

    setTimeout(() => {
      setSaveStatus(null);
      handleCancel();
    }, 2000);
  };

  const handleDelete = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    setSaveStatus({ type: 'success', message: 'Banner deleted successfully' });
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const toggleBannerActive = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-700">Banner Management</h1>
          <p className="text-gray-600 mt-1">Create and manage advertisement banners at different page positions</p>
        </div>
        {!editingId && (
          <Button variant="primary" onClick={handleNew}>
            <FiPlus size={18} />
            Create Banner
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {saveStatus && (
        <Alert
          variant={saveStatus.type}
          title={saveStatus.type === 'success' ? 'Success' : 'Error'}
        >
          {saveStatus.message}
        </Alert>
      )}

      {/* Create/Edit Form */}
      {editingId && (
        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-secondary-700 mb-6">
            {editingId === 'new' ? 'Create New Banner' : 'Edit Banner'}
          </h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Travel Promotion Q4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                >
                  <option value="">Select position</option>
                  {positions.map(pos => (
                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                >
                  {bannerTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="50"
                  max="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                />
              </div>
            </div>

            {/* Content Fields - Based on Type */}
            {(formData.type === 'image' || formData.type === 'carousel') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image(s)</label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-red-50 hover:border-[#ea0031] transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple={formData.type === 'carousel'}
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          
                          Promise.all(
                            files.map(file => new Promise((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result);
                              reader.readAsDataURL(file);
                            }))
                          ).then(results => {
                            setFormData(prev => ({
                              ...prev,
                              content: formData.type === 'carousel' 
                                ? (prev.content ? prev.content + ',' + results.join(',') : results.join(','))
                                : results[0]
                            }));
                          });
                        }} 
                      />
                      <div className="text-gray-500">
                        <div className="text-3xl mb-2 text-center">📸</div>
                        <div className="font-medium text-center">Click to upload image{formData.type === 'carousel' ? 's' : ''}</div>
                      </div>
                    </label>
                  </div>
                  
                  {formData.content && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-3">Preview:</p>
                      <div className="flex flex-wrap gap-4">
                        {formData.content.split(',').map((src, i) => src.trim() && (
                          <div key={i} className="relative group">
                            <img
                              src={src.trim()}
                              alt={`Preview ${i}`}
                              style={{ maxHeight: formData.height + 'px', maxWidth: '100%' }}
                              className="rounded border border-gray-200 shadow-sm"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="100"%3E%3Crect fill="%23ddd" width="400" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage Preview%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <button 
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newContent = formData.content.split(',').filter((_, index) => index !== i).join(',');
                                setFormData(prev => ({ ...prev, content: newContent }));
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.type === 'video' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL</label>
                <input
                  type="url"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                />
              </div>
            )}

            {formData.type === 'html' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom HTML</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter custom HTML content"
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
                />
              </div>
            )}

            {/* Link & CTA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Link URL</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
              />
              <p className="text-gray-600 text-xs mt-1">Where users are directed when clicking the banner</p>
            </div>

            {/* CTA Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Call-to-Action Text</label>
              <input
                type="text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleInputChange}
                placeholder="e.g., Learn More, Book Now, Explore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea0031]"
              />
            </div>

            {/* Display Settings */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-secondary-700 mb-3">Display Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-gray-600 text-xs mt-1">Leave empty for indefinite display</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display on Pages</label>
                  <select
                    name="displayOn"
                    value={formData.displayOn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Pages</option>
                    <option value="home">Home Page Only</option>
                    <option value="article">Article Pages Only</option>
                    <option value="category">Category Pages Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Click Behavior</label>
                  <select
                    name="clickBehavior"
                    value={formData.clickBehavior}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="navigate">Navigate to Link</option>
                    <option value="modal">Open Modal</option>
                    <option value="none">No Click Action</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility Options */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active (Show this banner)</span>
              </label>
            </div>

            {/* Analytics */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This banner will track impressions and clicks for analytics
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <FiSave size={18} />
              {editingId === 'new' ? 'Create Banner' : 'Update Banner'}
            </Button>
          </div>
        </Card>
      )}

      {/* Banners List */}
      {!editingId && (
        <div className="space-y-4">
          {banners.length === 0 ? (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-600 text-lg">No banners created yet</p>
              <Button variant="primary" onClick={handleNew} className="mt-4">
                <FiPlus size={18} />
                Create First Banner
              </Button>
            </Card>
          ) : (
            banners.map(banner => (
              <BannerCard
                key={banner.id}
                banner={banner}
                position={positions.find(p => p.value === banner.position)}
                onEdit={() => handleEdit(banner)}
                onDelete={() => handleDelete(banner.id)}
                onToggleActive={() => toggleBannerActive(banner.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Banner Card Component
 */
function BannerCard({ banner, position, onEdit, onDelete, onToggleActive }) {
  return (
    <Card className="bg-white border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6">
        {/* Preview */}
        <div className="col-span-1 md:col-span-1">
          <div
            className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center"
            style={{ height: Math.min(banner.height, 120) + 'px' }}
          >
            {banner.type === 'image' && banner.content && (
              <img
                src={banner.content.split(',')[0]}
                alt={banner.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            {(banner.type === 'video' || banner.type === 'html' || banner.type === 'carousel') && (
              <div className="text-center text-gray-600">
                <p className="text-xs font-semibold">{banner.type.toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-secondary-700">{banner.name}</h3>
              <Badge variant={banner.active ? 'success' : 'danger'}>
                {banner.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{position?.label}</p>
          </div>

          <div className="pt-2 space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Type:</span> {banner.type}
            </p>
            {banner.startDate && (
              <p className="text-gray-700">
                <span className="font-semibold">Period:</span> {banner.startDate} to {banner.endDate || 'Indefinite'}
              </p>
            )}
            {banner.link && (
              <p className="text-gray-700">
                <span className="font-semibold">Link:</span> <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{banner.link}</a>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
          <Button
            variant={banner.active ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            onClick={onToggleActive}
          >
            {banner.active ? 'Disable' : 'Enable'}
          </Button>
          <Button variant="ghost" size="sm" fullWidth onClick={onEdit}>
            <FiEdit3 size={16} />
            Edit
          </Button>
          <Button variant="danger" size="sm" fullWidth onClick={onDelete}>
            <FiTrash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Get banners from localStorage
 */
function getBannersFromStorage() {
  const stored = localStorage.getItem('nepal_explain_banners');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save banners to localStorage
 */
function saveBannersToStorage(banners) {
  localStorage.setItem('nepal_explain_banners', JSON.stringify(banners));
}

/**
 * Get empty banner form
 */
function getEmptyBannerForm() {
  return {
    id: null,
    name: '',
    position: '',
    type: 'image',
    content: '',
    link: '',
    ctaText: 'Learn More',
    height: 150,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    displayOn: 'all',
    clickBehavior: 'navigate',
    active: true,
  };
}

export default BannerControlPage;
