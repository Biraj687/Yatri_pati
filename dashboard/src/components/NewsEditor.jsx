import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Input, TextArea, Button, Badge } from './UI';

// Default categories - will be fetched from backend in real implementation
const DEFAULT_CATEGORIES = [
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
];

export function NewsEditor({ article, onSave, onCancel, loading = false, onMediaSelect, categories = DEFAULT_CATEGORIES }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    image_caption: '',
    video_url: '',
    category: '',
    tags: [],
    status: 'draft',
    rank: 0,
    sticky: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    authors: [{ name: 'Yatripati' }],
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        subtitle: article.subtitle || '',
        slug: article.slug || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        featured_image: article.featured_image || '',
        image_caption: article.image_caption || '',
        video_url: article.video_url || '',
        category: article.category || '',
        tags: article.tags || [],
        status: article.status || 'draft',
        rank: article.rank || 0,
        sticky: article.sticky || false,
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || [],
        authors: article.authors || [{ name: 'Yatripati' } ],
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target ).checked ,
    }));
  };

  const validateForm = ()=> {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.authors.length === 0) newErrors.authors = 'At least one author is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const addAuthor = () => {
    if (!authorInput.trim()) return;
    const newAuthor: Author = { name: authorInput.trim() };
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, newAuthor],
    }));
    setAuthorInput('');
  };

  const removeAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const newTag = tagInput.trim().toLowerCase();
    if (!formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const newKeyword = keywordInput.trim().toLowerCase();
    if (!formData.seoKeywords.includes(newKeyword)) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, newKeyword],
      }));
    }
    setKeywordInput('');
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onMediaSelect?.(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          featured_image: reader.result ,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter article title"
            error={errors.title}
            required
          />
          <Input
            label="Subtitle (optional)"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="Enter article subtitle"
          />
          <TextArea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write article content here..."
            rows={8}
            error={errors.content}
            required
          />
          <TextArea
            label="Excerpt (Summary)"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary of the article"
            rows={3}
          />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        <div className="space-y-4">
          
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            {formData.featured_image && (
              <div className="mb-4 relative group">
                <img src={formData.featured_image} alt="Featured" className="w-full max-h-64 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all">
                  <label className="cursor-pointer bg-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                </div>
              </div>
            )}
            {!formData.featured_image && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                <div className="text-gray-500">
                  <div className="text-3xl mb-2">📸</div>
                  Click to upload or drag and drop</div>
                  <div className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</div>
                </div>
              </label>
            )}
          </div>
          <TextArea
            label="Image Caption"
            name="image_caption"
            value={formData.image_caption}
            onChange={handleInputChange}
            placeholder="Caption for the featured image"
            rows={2}
          />
          <Input
            label="Video URL (optional)"
            name="video_url"
            value={formData.video_url}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
          />
        </div>
      </div>

      {/* Authors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authors</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Add author name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addAuthor()}
            />
            <Button onClick={addAuthor} size="sm">Add</Button>
          </div>
          {errors.authors && <p className="text-red-600 text-sm">{errors.authors}</p>}
          <div className="space-y-2">
            {formData.authors.map((author, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-900">{author.name}</span>
                <button onClick={() => removeAuthor(idx)} className="text-red-600 hover:text-red-700">
                  <FiX size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags & Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags & Categories</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">-- Select a Category --</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {!formData.category && <p className="text-gray-500 text-xs mt-1">Please select a category for this article</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag and press Enter or click Add"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="info">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:opacity-70">×</button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <Input
            label="SEO Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            placeholder="SEO title (55-60 characters)"
            maxLength={60}
          />
          <TextArea
            label="SEO Description"
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleInputChange}
            placeholder="SEO description (150-160 characters)"
            rows={2}
            maxLength={160}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.seoKeywords.map(keyword => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:opacity-70">×</button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
        <div className="space-y-4">
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sticky"
              name="sticky"
              checked={formData.sticky}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="sticky" className="text-sm font-medium text-gray-700">
              Make this article sticky (featured at the top)
            </label>
          </div>
          <Input
            label="Post Rank (for ordering, higher = more important)"
            name="rank"
            type="number"
            value={formData.rank}
            onChange={handleInputChange}
            min="0"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </div>
  );
}

