import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Input, TextArea, Button, Badge } from './UI';

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

const DEFAULT_SECTION_TITLES = {
  latest: 'ताजा समाचार',
  trending: 'विशेष सिफारिस',
  destination: 'गन्तव्य',
  packages: 'प्याकेज समाचार',
  hospitality: 'हस्पिटालिटि',
  hotels: 'होटल र रिसोर्ट',
};

function getSectionTitlesFromStorage() {
  try {
    const stored = localStorage.getItem('yatripati_settings');
    const parsed = stored ? JSON.parse(stored) : null;
    const titles = parsed?.sectionTitles;
    if (!titles || typeof titles !== 'object') return DEFAULT_SECTION_TITLES;

    return {
      latest: titles.latest || DEFAULT_SECTION_TITLES.latest,
      trending: titles.trending || DEFAULT_SECTION_TITLES.trending,
      destination: titles.destination || titles.destinations || DEFAULT_SECTION_TITLES.destination,
      packages: titles.packages || DEFAULT_SECTION_TITLES.packages,
      hospitality: titles.hospitality || DEFAULT_SECTION_TITLES.hospitality,
      hotels: titles.hotels || DEFAULT_SECTION_TITLES.hotels,
    };
  } catch {
    return DEFAULT_SECTION_TITLES;
  }
}

export function NewsEditor({
  article,
  onSave,
  onCancel,
  loading = false,
  onMediaSelect,
  categories = DEFAULT_CATEGORIES,
}) {
  const [sectionTitles, setSectionTitles] = useState(() => getSectionTitlesFromStorage());

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
    homepageSectionId: '',
    homepageSlot: '',
    tags: [],
    status: 'draft',
    rank: 0,
    sticky: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    authors: [{ name: 'Yatripati' }],
    scheduledPublishDate: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSectionTitles(getSectionTitlesFromStorage());

    if (!article) return;

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
      homepageSectionId: article.homepageSectionId || '',
      homepageSlot: article.homepageSlot || '',
      tags: article.tags || [],
      status: article.status || 'draft',
      rank: article.rank || 0,
      sticky: article.sticky || false,
      seoTitle: article.seoTitle || '',
      seoDescription: article.seoDescription || '',
      seoKeywords: article.seoKeywords || [],
      authors: article.authors || [{ name: 'Yatripati' }],
      scheduledPublishDate: article.scheduledPublishDate || '',
    });
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.homepageSectionId.trim()) newErrors.homepageSectionId = 'Homepage section is required';
    if (formData.homepageSectionId === 'hospitality' && !formData.homepageSlot.trim()) {
      newErrors.homepageSlot = 'Please choose left or right for Hospitality';
    }
    if (formData.homepageSectionId === 'latest' && !formData.homepageSlot.trim()) {
      newErrors.homepageSlot = 'Please choose Featured or List for Latest News';
    }
    if (formData.authors.length === 0) newErrors.authors = 'At least one author is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    await onSave(formData);
  };

  const homepageSlotOptions = (() => {
    if (formData.homepageSectionId === 'hospitality') {
      return [
        { value: 'left', label: 'Left (Large Cards)' },
        { value: 'right', label: 'Right (Compact Cards)' },
      ];
    }
    if (formData.homepageSectionId === 'latest') {
      return [
        { value: 'featured', label: 'Featured (Big Left)' },
        { value: 'list', label: 'List (Right Side)' },
      ];
    }
    return [];
  })();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onMediaSelect?.(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        featured_image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const addAuthor = () => {
    const name = authorInput.trim();
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, { name }],
    }));
    setAuthorInput('');
  };

  const removeAuthor = (index) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    const value = tagInput.trim().toLowerCase();
    if (!value || formData.tags.includes(value)) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, value],
    }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addKeyword = () => {
    const value = keywordInput.trim().toLowerCase();
    if (!value || formData.seoKeywords.includes(value)) return;

    setFormData((prev) => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, value],
    }));
    setKeywordInput('');
  };

  const removeKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((k) => k !== keyword),
    }));
  };

  return (
    <div className="space-y-6">
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
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="Enter article subtitle"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Homepage Section *</label>
            <select
              name="homepageSectionId"
              value={formData.homepageSectionId}
              onChange={(e) => {
                const nextSection = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  homepageSectionId: nextSection,
                  homepageSlot: '',
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">-- Select Homepage Section --</option>
              <option value="latest">{sectionTitles.latest}</option>
              <option value="trending">{sectionTitles.trending}</option>
              <option value="destination">{sectionTitles.destination}</option>
              <option value="packages">{sectionTitles.packages}</option>
              <option value="hospitality">{sectionTitles.hospitality}</option>
              <option value="hotels">{sectionTitles.hotels}</option>
            </select>
            {errors.homepageSectionId && <p className="text-red-600 text-sm mt-1">{errors.homepageSectionId}</p>}
          </div>

          {homepageSlotOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Homepage Placement *</label>
              <select
                name="homepageSlot"
                value={formData.homepageSlot}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">-- Select Placement --</option>
                {homepageSlotOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.homepageSlot && <p className="text-red-600 text-sm mt-1">{errors.homepageSlot}</p>}
            </div>
          )}
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
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary"
            rows={3}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            {formData.featured_image ? (
              <div className="mb-4 relative group">
                <img src={formData.featured_image} alt="Featured" className="w-full max-h-64 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all">
                  <label className="cursor-pointer bg-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors block">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                <div className="text-gray-500">
                  <div className="text-3xl mb-2">📸</div>
                  <div>Click to upload image</div>
                  <div className="text-xs text-gray-400">PNG, JPG up to 10MB</div>
                </div>
              </label>
            )}
          </div>
          <TextArea
            label="Image Caption"
            name="image_caption"
            value={formData.image_caption}
            onChange={handleInputChange}
            rows={2}
          />
          <Input
            label="Video URL"
            name="video_url"
            value={formData.video_url}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
          />
        </div>
      </div>

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAuthor();
                }
              }}
            />
            <Button onClick={addAuthor} size="sm">Add</Button>
          </div>
          {errors.authors && <p className="text-red-600 text-sm">{errors.authors}</p>}
          <div className="space-y-2">
            {formData.authors.map((author, idx) => (
              <div key={`${author.name}-${idx}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-900">{author.name}</span>
                <button type="button" onClick={() => removeAuthor(idx)} className="text-red-600 hover:text-red-700">
                  <FiX size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags & Categories</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button onClick={addTag} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="info">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:opacity-70">×</button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <Input
            label="SEO Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            maxLength={60}
          />
          <TextArea
            label="SEO Description"
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleInputChange}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button onClick={addKeyword} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.seoKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                  <button type="button" onClick={() => removeKeyword(keyword)} className="ml-1 hover:opacity-70">×</button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

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
            label="Post Rank (higher = more important)"
            name="rank"
            type="number"
            value={formData.rank}
            onChange={handleInputChange}
            min="0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Publish Date (Optional)</label>
            <input
              type="datetime-local"
              name="scheduledPublishDate"
              value={formData.scheduledPublishDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Set a future date and time to auto-publish this article.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </div>
  );
}

