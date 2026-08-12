import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiSave, FiDownload } from 'react-icons/fi';
import { Button, Alert, TextArea, Input, Badge } from './UI';

/**
 * Advanced News Editor - Complete article management with all fields
 * Includes: title, excerpt, content, media (image/video/thumbnail), SEO, authors, tags, etc.
 */
export function AdvancedNewsEditor({ article, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    authors: [],
    date: '',
    image: '',
    thumbnailImage: '',
    videoUrl: '',
    imageCaption: '',
    tags: [],
    slug: '',
    featured: false,
    sticky: false,
    status: 'draft', // draft, published, scheduled
    scheduledPublishDate: '',
    views: 0,
    readTime: '',
    source: '',
    // SEO Fields
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    // Additional metadata
    rank: 0,
    section: 'news',
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [showAdvancedSection, setShowAdvancedSection] = useState(false);

  const categories = [
    'Politics',
    'Tourism',
    'Economy',
    'Culture',
    'Entertainment',
    'Sports',
    'Technology',
    'Health',
    'Education',
    'Travel',
    'Business',
    'Lifestyle',
    'Travel Tips',
    'Hospitality',
    'Hotels',
    'Resorts',
    'Destinations'
  ];

  useEffect(() => {
    if (article) {
      setFormData(prev => ({
        ...prev,
        ...article,
        authors: article.authors || [article.author] || [],
      }));
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.seoKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword)
    }));
  };

  const handleAddAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()]
      }));
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (author) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a !== author)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Featured image is required';
    if (!formData.author && formData.authors.length === 0) newErrors.author = 'At least one author is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setFormData(prev => ({ ...prev, slug }));
  };

  const calculateReadTime = () => {
    const wordsPerMinute = 200;
    const wordCount = formData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    setFormData(prev => ({ ...prev, readTime: `${readTime} min read` }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {article?.id ? 'Edit Article' : 'Create New Article'}
        </h1>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <FiX size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter article title"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              <p className="text-gray-600 text-xs mt-1">Character count: {formData.title.length}</p>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle (Optional)</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter subtitle"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category & Author Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Main author name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.author ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
              </div>
            </div>

            {/* Publication Date & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the article (50-160 characters recommended)"
                rows="2"
                maxLength="200"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.excerpt && <p className="text-red-600 text-sm mt-1">{errors.excerpt}</p>}
              <p className="text-gray-600 text-xs mt-1">{formData.excerpt.length}/200 characters</p>
            </div>
          </div>
        </section>

        {/* Media Section */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Media</h2>
          <div className="space-y-4">
            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {formData.image ? (
                  <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200">
                      <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform scale-95 group-hover:scale-100">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, image: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors h-48">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="text-gray-500 text-center">
                      <div className="text-4xl mb-3">📸</div>
                      <div className="font-medium">Click to upload featured image</div>
                      <div className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 10MB)</div>
                    </div>
                  </label>
                )}
              </div>
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail Image (Optional - for hover display)
              </label>
              <div className="space-y-4">
                {formData.thumbnailImage ? (
                  <div className="relative group w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={formData.thumbnailImage}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200">
                      <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform scale-95 group-hover:scale-100">
                        Change Thumbnail
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, thumbnailImage: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors h-32">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, thumbnailImage: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="text-gray-500 text-center">
                      <div className="text-2xl mb-1">🖼️</div>
                      <div className="font-medium text-sm">Upload thumbnail image</div>
                    </div>
                  </label>
                )}
              </div>
              <p className="text-gray-600 text-xs mt-2">Smaller image for specific section displays</p>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video URL (Optional - for hero section)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/video.mp4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-600 text-xs mt-1">MP4 video for featured section</p>
            </div>

            {/* Image Caption */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image Caption</label>
              <input
                type="text"
                name="imageCaption"
                value={formData.imageCaption}
                onChange={handleInputChange}
                placeholder="Description of the image"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your article content here... (HTML tags supported)"
                rows="10"
                className={`w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-600 text-xs">{formData.content.split(/\s+/).length} words</p>
                <Button variant="ghost" size="sm" onClick={calculateReadTime}>
                  Calculate Read Time
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button variant="primary" size="sm" onClick={handleAddTag}>
                  <FiPlus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="primary">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:opacity-70"
                    >
                      <FiX size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Multiple Authors */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Authors</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAuthor()}
              placeholder="Add co-author name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="primary" size="sm" onClick={handleAddAuthor}>
              <FiPlus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.authors.map(author => (
              <Badge key={author} variant="secondary">
                {author}
                <button
                  onClick={() => handleRemoveAuthor(author)}
                  className="ml-2 hover:opacity-70"
                >
                  <FiX size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </section>

        {/* SEO Section */}
        <section className="border-t border-gray-200 pt-6">
          <button
            onClick={() => setShowSeoSection(!showSeoSection)}
            className="flex items-center gap-2 mb-4 font-bold text-gray-900"
          >
            SEO Settings {showSeoSection ? '▼' : '▶'}
          </button>

          {showSeoSection && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title (50-60 characters)"
                  maxLength="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-600 text-xs mt-1">{formData.seoTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  placeholder="Meta description (150-160 characters)"
                  maxLength="160"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-600 text-xs mt-1">{formData.seoDescription.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="Add keyword"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddKeyword}>
                    <FiPlus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seoKeywords.map(keyword => (
                    <Badge key={keyword} variant="info">
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 hover:opacity-70"
                      >
                        <FiX size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Advanced Section */}
        <section className="border-t border-gray-200 pt-6">
          <button
            onClick={() => setShowAdvancedSection(!showAdvancedSection)}
            className="flex items-center gap-2 mb-4 font-bold text-gray-900"
          >
            Advanced Options {showAdvancedSection ? '▼' : '▶'}
          </button>

          {showAdvancedSection && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="article-url-slug"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button variant="primary" size="sm" onClick={generateSlug}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rank/Priority</label>
                  <input
                    type="number"
                    name="rank"
                    value={formData.rank}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Source/Attribution</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="News source"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sticky"
                    checked={formData.sticky}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Sticky (Always on top)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Publish Date</label>
                <input
                  type="datetime-local"
                  name="scheduledPublishDate"
                  value={formData.scheduledPublishDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer - Action Buttons */}
      <div className="border-t border-gray-200 p-6 flex gap-2 justify-end sticky bottom-0 bg-gray-50">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          <FiSave size={18} />
          {article?.id ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </div>
  );
}

export default AdvancedNewsEditor;
