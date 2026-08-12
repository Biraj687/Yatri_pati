import { useState } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiSave, FiX, FiChevronDown, FiChevronUp, FiEye, FiEyeOff } from 'react-icons/fi';
import { useFrontendControl } from '@context/FrontendControlContext';

/**
 * MASTER DASHBOARD - Complete Frontend Control Center
 * Connected to global FrontendControlContext
 * Changes appear LIVE on homepage, navbar, footer, sections, and advertisements
 */
export function MasterDashboard() {
  const [activeTab, setActiveTab] = useState('hero');
  const [showAdForm, setShowAdForm] = useState(false);
  const [newAd, setNewAd] = useState({ name: '', image: '', link: '', position: 'hero-top' });

  // Use global context - changes automatically update entire app
  const {
    heroConfig,
    updateHeroConfig,
    navbarConfig,
    updateNavbarConfig,
    sections,
    updateSection,
    toggleSectionVisibility,
    advertisements,
    addAdvertisement,
    removeAdvertisement,
    toggleAdVisibility,
    footerConfig,
    updateFooterConfig,
  } = useFrontendControl();

  const adPositions = [
    'hero-top',
    'hero-bottom',
    'after-latest',
    'after-trending',
    'after-packages',
    'after-hospitality',
    'before-footer',
    'sidebar'
  ];

  const handleAddAdvertisement = () => {
    if (newAd.name && newAd.image && newAd.link) {
      addAdvertisement({ ...newAd, visible: true });
      setNewAd({ name: '', image: '', link: '', position: 'hero-top' });
      setShowAdForm(false);
    }
  };

  const toggleNavbarCategory = (index) => {
    const updatedCategories = navbarConfig.categories.map((cat, i) =>
      i === index ? { ...cat, visible: !cat.visible } : cat
    );
    updateNavbarConfig({ categories: updatedCategories });
  };

  const toggleFooterLink = (index) => {
    const updatedLinks = footerConfig.links.map((link, i) =>
      i === index ? { ...link, visible: !link.visible } : link
    );
    updateFooterConfig({ links: updatedLinks });
  };

  const toggleFooterSocial = (index) => {
    const updatedSocial = footerConfig.social.map((soc, i) =>
      i === index ? { ...soc, visible: !soc.visible } : soc
    );
    updateFooterConfig({ social: updatedSocial });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-secondary-700 mb-2">🎛️ Nepal Explain Master Dashboard</h1>
          <p className="text-gray-600 text-lg">⚡ LIVE changes - Everything updates in real-time on your website!</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b-2 border-gray-200 overflow-x-auto pb-4">
          {[
            { id: 'hero', label: '🎬 Hero Section', icon: '🎬' },
            { id: 'navbar', label: '📱 Navigation Bar', icon: '📱' },
            { id: 'sections', label: '📰 News Sections', icon: '📰' },
            { id: 'ads', label: '📢 Advertisements', icon: '📢' },
            { id: 'footer', label: '🔗 Footer', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-secondary-600 text-white border-b-4 border-secondary-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HERO SECTION TAB */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-secondary-700">🎬 Hero Section Control</h2>
            <p className="text-green-600 font-bold text-lg">✨ Changes apply INSTANTLY to your homepage!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={heroConfig.title}
                    onChange={(e) => updateHeroConfig({ title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#ea0031] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={heroConfig.subtitle}
                    onChange={(e) => updateHeroConfig({ subtitle: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#ea0031] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
                  <label className="flex items-center gap-3 w-full px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#ea0031] hover:bg-red-50 transition-colors">
                    <span className="text-2xl">🖼️</span>
                    <span className="text-gray-600 font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateHeroConfig({ image: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {heroConfig.image && <img src={heroConfig.image} alt="Hero bg" className="mt-4 h-24 rounded object-cover shadow-sm w-full" />}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Video URL</label>
                  <input
                    type="url"
                    value={heroConfig.videoUrl}
                    onChange={(e) => updateHeroConfig({ videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#ea0031] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-play Duration (seconds)</label>
                  <input
                    type="number"
                    value={heroConfig.duration}
                    onChange={(e) => updateHeroConfig({ duration: parseInt(e.target.value) })}
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroConfig.visible}
                      onChange={(e) => updateHeroConfig({ visible: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">Show Hero Section</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroConfig.autoPlay}
                      onChange={(e) => updateHeroConfig({ autoPlay: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">Auto-play Video</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Live Preview</label>
                <div className="relative bg-gray-200 rounded-lg h-96 overflow-hidden border-2 border-gray-300">
                  {heroConfig.image && (
                    <img
                      src={heroConfig.image}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  {!heroConfig.image && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-center">No image - upload an image to preview</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="text-3xl font-bold">{heroConfig.title}</h3>
                    <p className="text-lg mt-2">{heroConfig.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVBAR TAB */}
        {activeTab === 'navbar' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-secondary-700">📱 Navigation Bar Control</h2>
            <p className="text-green-600 font-bold text-lg">✨ Navbar updates LIVE as you type!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Navbar Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Text</label>
                  <input
                    type="text"
                    value={navbarConfig.logoText}
                    onChange={(e) => updateNavbarConfig({ logoText: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={navbarConfig.logoColor}
                      onChange={(e) => updateNavbarConfig({ logoColor: e.target.value })}
                      className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={navbarConfig.logoColor}
                      onChange={(e) => updateNavbarConfig({ logoColor: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Navbar Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={navbarConfig.backgroundColor}
                      onChange={(e) => updateNavbarConfig({ backgroundColor: e.target.value })}
                      className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={navbarConfig.backgroundColor}
                      onChange={(e) => updateNavbarConfig({ backgroundColor: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={navbarConfig.sticky}
                      onChange={(e) => updateNavbarConfig({ sticky: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">Sticky Navbar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={navbarConfig.searchEnabled}
                      onChange={(e) => updateNavbarConfig({ searchEnabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">Show Search Bar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={navbarConfig.showCategories}
                      onChange={(e) => updateNavbarConfig({ showCategories: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">Show Categories</span>
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories in Navbar</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {navbarConfig.categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => toggleNavbarCategory(idx)}
                        className={`transition-colors ${
                          cat.visible ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {cat.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                      </button>
                      <span className="font-semibold flex-1">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navbar Preview */}
            <div
              className="w-full h-20 rounded-lg border-2 border-gray-300 flex items-center px-6 gap-6"
              style={{ backgroundColor: navbarConfig.backgroundColor }}
            >
              <div style={{ color: navbarConfig.logoColor }} className="font-bold text-xl">
                {navbarConfig.logoText}
              </div>
              <div className="flex gap-4 ml-auto">
                {navbarConfig.showCategories && navbarConfig.categories
                  .filter(c => c.visible)
                  .slice(0, 3)
                  .map((cat, idx) => (
                    <span key={idx} style={{ color: navbarConfig.textColor }} className="text-sm font-semibold">
                      {cat.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* NEWS SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-secondary-700">📰 News Sections Management</h2>
            <p className="text-green-600 font-bold text-lg">✨ Section visibility changes apply INSTANTLY!</p>

            <div className="space-y-4">
              {sections.map(section => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onToggleVisibility={() => toggleSectionVisibility(section.id)}
                  onUpdate={(updates) => updateSection(section.id, updates)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ADVERTISEMENTS TAB */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-secondary-700">📢 Advertisement Manager</h2>
                <p className="text-green-600 font-bold text-lg">✨ Ads appear INSTANTLY on the site!</p>
              </div>
              <button
                onClick={() => setShowAdForm(!showAdForm)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
              >
                <FiPlus size={20} />
                Create Advertisement
              </button>
            </div>

            {/* Advertisement Form */}
            {showAdForm && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">New Advertisement</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Name</label>
                    <input
                      type="text"
                      value={newAd.name}
                      onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                      placeholder="e.g., Summer Promotion"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                    <select
                      value={newAd.position}
                      onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {adPositions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Ad Image</label>
                    <label className="flex items-center gap-3 w-full px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <span className="text-2xl">📸</span>
                      <span className="text-gray-600 font-medium">Click to upload ad creatives</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewAd({ ...newAd, image: reader.result });
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {newAd.image && <img src={newAd.image} alt="Ad Preview" className="mt-4 max-h-32 rounded object-contain shadow-sm border border-gray-200" />}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Click Link</label>
                    <input
                      type="url"
                      value={newAd.link}
                      onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddAdvertisement}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <FiPlus size={20} />
                    Add Advertisement
                  </button>
                  <button
                    onClick={() => setShowAdForm(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <FiX size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Advertisements List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Active Advertisements ({advertisements.length})</h3>

              {advertisements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No advertisements yet. Create one to get started!</p>
              ) : (
                advertisements.map(ad => (
                  <AdvertisementCard
                    key={ad.id}
                    ad={ad}
                    onToggleVisibility={() => toggleAdVisibility(ad.id)}
                    onDelete={() => removeAdvertisement(ad.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-secondary-700">🔗 Footer Control</h2>
            <p className="text-green-600 font-bold text-lg">✨ Footer changes apply INSTANTLY!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Footer Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={footerConfig.companyName}
                    onChange={(e) => updateFooterConfig({ companyName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={footerConfig.description}
                    onChange={(e) => updateFooterConfig({ description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={footerConfig.backgroundColor}
                      onChange={(e) => updateFooterConfig({ backgroundColor: e.target.value })}
                      className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={footerConfig.backgroundColor}
                      onChange={(e) => updateFooterConfig({ backgroundColor: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={footerConfig.textColor}
                      onChange={(e) => updateFooterConfig({ textColor: e.target.value })}
                      className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={footerConfig.textColor}
                      onChange={(e) => updateFooterConfig({ textColor: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Links & Social */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Footer Links</h3>
                  <div className="space-y-2">
                    {footerConfig.links.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => toggleFooterLink(idx)}
                          className={`transition-colors ${link.visible ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {link.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{link.name}</p>
                          <p className="text-xs text-gray-500">{link.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Social Media Links</h3>
                  <div className="space-y-2">
                    {footerConfig.social.map((soc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => toggleFooterSocial(idx)}
                          className={`transition-colors ${soc.visible ? 'text-[#ea0031]' : 'text-gray-400'}`}
                        >
                          {soc.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{soc.platform}</p>
                          <p className="text-xs text-gray-500">{soc.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Preview */}
            <div
              className="rounded-lg p-8 text-center"
              style={{ backgroundColor: footerConfig.backgroundColor, color: footerConfig.textColor }}
            >
              <h4 className="text-2xl font-bold mb-2">{footerConfig.companyName}</h4>
              <p className="text-sm mb-4">{footerConfig.description}</p>
              <div className="flex gap-4 justify-center text-lg mb-4">
                {footerConfig.social.filter(s => s.visible).map((soc, idx) => (
                  <span key={idx}>{soc.platform}</span>
                ))}
              </div>
              <div className="flex gap-4 justify-center text-sm">
                {footerConfig.links.filter(l => l.visible).map((link, idx) => (
                  <span key={idx}>{link.name}</span>
                ))}
              </div>
              <p className="text-xs mt-6 border-t pt-4">© 2026 {footerConfig.companyName}. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Section Control Card Component
 */
function SectionCard({ section, onToggleVisibility, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-gradient-to-r from-red-500 to-[#ea0031] text-white flex justify-between items-center cursor-pointer hover:from-red-600 hover:to-[#c9002a] transition"
      >
        <div>
          <h3 className="text-lg font-bold">{section.name}</h3>
          <p className="text-sm">Layout: {section.layout} | Max: {section.maxArticles} articles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`transition-colors px-4 py-2 rounded-lg font-semibold ${
              section.visible ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
            }`}
          >
            {section.visible ? 'VISIBLE' : 'HIDDEN'}
          </button>
          {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Name</label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Layout Type</label>
            <select
              value={section.layout}
              onChange={(e) => onUpdate({ layout: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="featured-compact">Featured + Compact</option>
              <option value="grid-2">2 Column Grid</option>
              <option value="grid-3">3 Column Grid</option>
              <option value="grid-4">4 Column Grid</option>
              <option value="list">Vertical List</option>
              <option value="two-column">Two Column</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Articles to Display</label>
            <input
              type="number"
              value={section.maxArticles}
              onChange={(e) => onUpdate({ maxArticles: parseInt(e.target.value) })}
              min="1"
              max="20"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Advertisement Card Component
 */
function AdvertisementCard({ ad, onToggleVisibility, onDelete }) {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex gap-4">
      {/* Ad Image Preview */}
      <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
        {ad.image ? (
          <img src={ad.image} alt={ad.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
        )}
      </div>

      {/* Ad Details */}
      <div className="flex-1 space-y-2">
        <h4 className="text-lg font-bold text-gray-900">{ad.name}</h4>
        <p className="text-sm text-gray-600">Position: <span className="font-semibold">{ad.position}</span></p>
        <p className="text-sm text-gray-600">Link: <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{ad.link}</a></p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleVisibility}
          className={`transition-colors px-4 py-2 rounded-lg font-semibold ${
            ad.visible ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
          }`}
        >
          {ad.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </button>

        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
        >
          <FiTrash2 size={20} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default MasterDashboard;
