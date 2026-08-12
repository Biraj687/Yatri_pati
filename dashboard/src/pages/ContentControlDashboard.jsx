import React, { useState, useContext, useEffect } from 'react';
import { FiEdit3, FiEye, FiEyeOff, FiSettings, FiPlus, FiSave, FiRefreshCw, FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';
import { FrontendControlContext } from '../context/FrontendControlContext';

/**
 * Content Control Dashboard - Comprehensive control panel for all frontend sections
 * Manage every single section, article display, visibility, and layout
 */
export function ContentControlDashboard() {
  const context = useContext(FrontendControlContext);
  if (!context) {
    return <div className="p-8 text-red-600">Error: FrontendControlContext not found</div>;
  }

  const {
    sections,
    updateSection,
    toggleSectionVisibility,
    heroConfig,
    updateHeroConfig,
    navbarConfig,
    updateNavbarConfig,
    footerConfig,
    updateFooterConfig,
  } = context;

  const [expandedSection, setExpandedSection] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');

  const handleSectionUpdate = (sectionId, updates) => {
    updateSection(sectionId, updates);
  };

  const handleSaveNotif = () => {
    setSaveStatus({ type: 'success', message: 'All changes saved to localStorage' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Navbar handlers
  const [editingNavbar, setEditingNavbar] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-700">📋 Content Control Hub</h1>
          <p className="text-gray-600 mt-1">Manage navbar, hero, sections, and all frontend content</p>
        </div>
        <button
          onClick={handleSaveNotif}
          className="bg-[#ea0031] hover:bg-[#c9002a] text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <FiSave size={18} />
          Save All
        </button>
      </div>

      {/* Status */}
      {saveStatus && (
        <div className={`px-4 py-3 rounded-lg ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveStatus.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 font-medium ${activeTab === 'sections' ? 'border-b-2 border-[#ea0031] text-[#ea0031]' : 'text-gray-600'}`}
        >
          📂 Sections
        </button>
        <button
          onClick={() => setActiveTab('navbar')}
          className={`px-4 py-2 font-medium ${activeTab === 'navbar' ? 'border-b-2 border-[#ea0031] text-[#ea0031]' : 'text-gray-600'}`}
        >
          🔗 Navbar
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 font-medium ${activeTab === 'hero' ? 'border-b-2 border-[#ea0031] text-[#ea0031]' : 'text-gray-600'}`}
        >
          🎬 Hero
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 font-medium ${activeTab === 'footer' ? 'border-b-2 border-[#ea0031] text-[#ea0031]' : 'text-gray-600'}`}
        >
          🔻 Footer
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionControlCard
              key={section.id}
              section={section}
              isExpanded={expandedSection === section.id}
              onToggleExpand={() =>
                setExpandedSection(expandedSection === section.id ? null : section.id)
              }
              onUpdate={(updates) => handleSectionUpdate(section.id, updates)}
              onToggle={() => toggleSectionVisibility(section.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'navbar' && (
        <NavbarControlPanel
          config={navbarConfig}
          onUpdate={updateNavbarConfig}
        />
      )}

      {activeTab === 'hero' && (
        <HeroControlPanel
          config={heroConfig}
          onUpdate={updateHeroConfig}
        />
      )}

      {activeTab === 'footer' && (
        <FooterControlPanel
          config={footerConfig}
          onUpdate={updateFooterConfig}
        />
      )}
    </div>
  );
}

/**
 * Section Control Card
 */
function SectionControlCard({ section, isExpanded, onToggleExpand, onUpdate, onToggle }) {
  const layoutOptions = [
    'featured-compact',
    'grid-3',
    'grid-4',
    'two-column',
    'list-vertical',
    'list-horizontal',
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={onToggleExpand}
        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
      >
        <div className="flex-1">
          <h2 className="text-lg font-bold text-secondary-700">{section.name}</h2>
          <p className="text-sm text-gray-600 mt-1">Layout: {section.layout}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              section.visible
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {section.visible ? '✓ Visible' : '✗ Hidden'}
          </button>
          {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Section Name
            </label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Layout Type
            </label>
            <select
              value={section.layout}
              onChange={(e) => onUpdate({ layout: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {layoutOptions.map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Articles: {section.maxArticles}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={section.maxArticles}
              onChange={(e) => onUpdate({ maxArticles: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Navbar Control Panel
 */
function NavbarControlPanel({ config, onUpdate }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo Text
          </label>
          <input
            type="text"
            value={config.logoText}
            onChange={(e) => onUpdate({ logoText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo Color
          </label>
          <input
            type="color"
            value={config.logoColor}
            onChange={(e) => onUpdate({ logoColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={config.textColor}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.sticky}
            onChange={(e) => onUpdate({ sticky: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Sticky Navbar</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.searchEnabled}
            onChange={(e) => onUpdate({ searchEnabled: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Show Search</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showCategories}
            onChange={(e) => onUpdate({ showCategories: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Show Categories</span>
        </label>
      </div>
    </div>
  );
}

/**
 * Hero Control Panel
 */
function HeroControlPanel({ config, onUpdate }) {
  const [imagePreview, setImagePreview] = React.useState(config.imageUrl || '');

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      {/* Content Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">📝 Content</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter hero section title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter hero section subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={config.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter hero section description"
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">🖼️ Image</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Hero Image
            </label>
            <label className="flex items-center gap-3 w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors justify-center">
              <span className="text-3xl text-gray-400">📸</span>
              <span className="text-gray-600 font-medium">Click to upload new image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result);
                      onUpdate({ imageUrl: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {imagePreview && (
            <div className="rounded-lg overflow-hidden bg-gray-100 max-h-96">
              <img
                src={imagePreview}
                alt="Hero preview"
                className="w-full h-auto max-h-96 object-cover"
                onError={() => setImagePreview('')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Button Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">🔘 Button</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={config.buttonText || ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Learn More, Explore, Get Started"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Button Link
            </label>
            <input
              type="url"
              value={config.buttonLink || ''}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Button Background Color
            </label>
            <input
              type="color"
              value={config.buttonColor || '#3B82F6'}
              onChange={(e) => onUpdate({ buttonColor: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">⚙️ Display Options</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.visible}
              onChange={(e) => onUpdate({ visible: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Visible on Website</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoPlay}
              onChange={(e) => onUpdate({ autoPlay: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Auto Play Slideshow</span>
          </label>
        </div>

        {config.autoPlay && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slide Duration: {config.duration}s
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={config.duration || 5}
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Footer Control Panel
 */
function FooterControlPanel({ config, onUpdate }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={config.companyName}
          onChange={(e) => onUpdate({ companyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={config.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={config.textColor}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
