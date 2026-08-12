import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { Button, Alert, Badge } from '@components';

/**
 * Site Settings Page - Configure all site-wide settings
 */
export function SiteSettingsPage() {
  const [settings, setSettings] = useState(getSettingsFromStorage());
  const [saveStatus, setSaveStatus] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setChanged(true);
  };

  const handleNestedChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setChanged(true);
  };

  const handleNavigationChange = (index, field, value) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      nextNav[index] = { ...nextNav[index], [field]: value };
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const addNavigationItem = () => {
    setSettings((prev) => ({
      ...prev,
      navigation: [
        ...(prev.navigation || []),
        { label: 'नयाँ', path: '/category/new', isCategory: true, hasDropdown: false, dropdownItems: [] },
      ],
    }));
    setChanged(true);
  };

  const removeNavigationItem = (index) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      nextNav.splice(index, 1);
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const moveNavigationItem = (fromIndex, toIndex) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      if (toIndex < 0 || toIndex >= nextNav.length) return prev;
      const [item] = nextNav.splice(fromIndex, 1);
      nextNav.splice(toIndex, 0, item);
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const addDropdownItem = (navIndex) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      const current = nextNav[navIndex];
      const dropdownItems = Array.isArray(current.dropdownItems) ? current.dropdownItems : [];
      nextNav[navIndex] = {
        ...current,
        hasDropdown: true,
        dropdownItems: [...dropdownItems, { label: 'उप-आइटम', path: '/category/sub' }],
      };
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const updateDropdownItem = (navIndex, itemIndex, field, value) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      const current = nextNav[navIndex];
      const dropdownItems = Array.isArray(current.dropdownItems) ? [...current.dropdownItems] : [];
      dropdownItems[itemIndex] = { ...dropdownItems[itemIndex], [field]: value };
      nextNav[navIndex] = { ...current, dropdownItems };
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const removeDropdownItem = (navIndex, itemIndex) => {
    setSettings((prev) => {
      const nextNav = [...(prev.navigation || [])];
      const current = nextNav[navIndex];
      const dropdownItems = Array.isArray(current.dropdownItems) ? [...current.dropdownItems] : [];
      dropdownItems.splice(itemIndex, 1);
      nextNav[navIndex] = { ...current, dropdownItems };
      return { ...prev, navigation: nextNav };
    });
    setChanged(true);
  };

  const handleSave = () => {
    setSaveStatus({ type: 'success', message: 'Settings saved successfully' });
    setChanged(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    setSettings(getSettingsFromStorage());
    setChanged(false);
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-700">Site Settings</h1>
          <p className="text-gray-600 mt-1">Configure all site-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {changed && (
            <>
              <Button variant="secondary" onClick={handleReset}>
                <FiRefreshCw size={18} />
                Discard
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <FiSave size={18} />
                Save Changes
              </Button>
            </>
          )}
        </div>
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

      {changed && (
        <Alert variant="warning" title="Unsaved Changes">
          You have unsaved changes. Click "Save Changes" to apply them.
        </Alert>
      )}

      {/* General Settings */}
      <SettingsSection title="General Settings" description="Basic site information">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site URL</label>
            <input
              type="url"
              name="siteUrl"
              value={settings.siteUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Navigation */}
      <SettingsSection
        title="Navigation (Navbar Items)"
        description="Control the main navbar items shown on the website (including dropdowns like प्रदेश)"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Add/remove/reorder items and edit dropdown children.
            </div>
            <Button variant="secondary" onClick={addNavigationItem}>
              + Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {(settings.navigation || []).map((item, index) => (
              <div key={`${item.label}-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm font-semibold text-gray-900">
                    Item {index + 1}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => moveNavigationItem(index, index - 1)}>
                      ↑
                    </Button>
                    <Button variant="ghost" onClick={() => moveNavigationItem(index, index + 1)}>
                      ↓
                    </Button>
                    <Button variant="danger" onClick={() => removeNavigationItem(index)}>
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Label</label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => handleNavigationChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="होमपेज"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Path</label>
                    <input
                      type="text"
                      value={item.path || ''}
                      onChange={(e) => handleNavigationChange(index, 'path', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/category/xxx"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!item.isCategory}
                      onChange={(e) => handleNavigationChange(index, 'isCategory', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Is Category</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!item.hasDropdown}
                      onChange={(e) => handleNavigationChange(index, 'hasDropdown', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Has Dropdown</span>
                  </label>
                </div>

                {item.hasDropdown && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-800">Dropdown Items</div>
                      <Button variant="secondary" onClick={() => addDropdownItem(index)}>
                        + Add Dropdown Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(item.dropdownItems || []).length === 0 ? (
                        <div className="text-sm text-gray-500">No dropdown items.</div>
                      ) : (
                        (item.dropdownItems || []).map((sub, subIndex) => (
                          <div key={`${sub.label}-${subIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Label</label>
                              <input
                                type="text"
                                value={sub.label || ''}
                                onChange={(e) => updateDropdownItem(index, subIndex, 'label', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Path</label>
                                <input
                                  type="text"
                                  value={sub.path || ''}
                                  onChange={(e) => updateDropdownItem(index, subIndex, 'path', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <Button variant="danger" onClick={() => removeDropdownItem(index, subIndex)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Section Titles */}
      <SettingsSection
        title="Section Titles"
        description="Customize the titles for each section on the homepage"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Latest News (समाचार)</label>
            <input
              type="text"
              value={settings.sectionTitles.latest}
              onChange={(e) => handleNestedChange('sectionTitles', 'latest', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trending (विशेष सिफारिस)</label>
            <input
              type="text"
              value={settings.sectionTitles.trending}
              onChange={(e) => handleNestedChange('sectionTitles', 'trending', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">News Packages (प्याकेज समाचार)</label>
            <input
              type="text"
              value={settings.sectionTitles.packages}
              onChange={(e) => handleNestedChange('sectionTitles', 'packages', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hospitality (हस्पिटालिटि)</label>
            <input
              type="text"
              value={settings.sectionTitles.hospitality}
              onChange={(e) => handleNestedChange('sectionTitles', 'hospitality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destinations (गन्तव्य)</label>
            <input
              type="text"
              value={settings.sectionTitles.destination}
              onChange={(e) => handleNestedChange('sectionTitles', 'destination', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hotels (होटल र रिसोर्ट)</label>
            <input
              type="text"
              value={settings.sectionTitles.hotels}
              onChange={(e) => handleNestedChange('sectionTitles', 'hotels', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Display Preferences */}
      <SettingsSection
        title="Display Preferences"
        description="Control what's shown on the frontend"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showComments}
              onChange={(e) => handleInputChange({ target: { name: 'showComments', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Article Comments</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showAuthorBio}
              onChange={(e) => handleInputChange({ target: { name: 'showAuthorBio', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Author Biography</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showViewCount}
              onChange={(e) => handleInputChange({ target: { name: 'showViewCount', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Article View Count</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showSocialSharing}
              onChange={(e) => handleInputChange({ target: { name: 'showSocialSharing', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Social Sharing Buttons</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showRelatedArticles}
              onChange={(e) => handleInputChange({ target: { name: 'showRelatedArticles', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Related Articles</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableSearch}
              onChange={(e) => handleInputChange({ target: { name: 'enableSearch', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Search Feature</span>
          </label>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance" description="Customize the look and feel">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleInputChange}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="secondaryColor"
                value={settings.secondaryColor}
                onChange={handleInputChange}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
            <select
              name="fontFamily"
              value={settings.fontFamily}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="system">System Default</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="mono">Monospace</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleInputChange({ target: { name: 'darkMode', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Dark Mode</span>
          </label>
        </div>
      </SettingsSection>

      {/* Social Media Links */}
      <SettingsSection
        title="Social Media Links"
        description="Add links to your social media profiles"
      >
        <div className="space-y-3">
          {Object.entries(settings.socialLinks || {}).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{platform}</label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleNestedChange('socialLinks', platform, e.target.value)}
                placeholder={`https://${platform}.com/yourprofile`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* SEO Settings */}
      <SettingsSection
        title="SEO Settings"
        description="Optimize your site for search engines"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Analytics ID</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={settings.googleAnalyticsId}
              onChange={handleInputChange}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Search Console Verification</label>
            <input
              type="text"
              name="googleSearchConsole"
              value={settings.googleSearchConsole}
              onChange={handleInputChange}
              placeholder="Verification code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords (Comma Separated)</label>
            <textarea
              name="metaKeywords"
              value={settings.metaKeywords}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </SettingsSection>

      {/* API Configuration */}
      <SettingsSection
        title="API Configuration"
        description="Configure API and data source settings"
      >
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={settings.useMockData}
                onChange={(e) => handleInputChange({ target: { name: 'useMockData', value: e.target.checked, type: 'checkbox' } })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Use Mock Data (Development)</span>
            </label>
            <p className="text-sm text-gray-600 px-6">When enabled, the frontend will use sample data instead of API calls</p>
          </div>

          {!settings.useMockData && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">API Base URL</label>
                <input
                  type="url"
                  name="apiBaseUrl"
                  value={settings.apiBaseUrl}
                  onChange={handleInputChange}
                  placeholder="https://api.example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">API Timeout (seconds)</label>
                <input
                  type="number"
                  name="apiTimeout"
                  value={settings.apiTimeout}
                  onChange={handleInputChange}
                  min="5"
                  max="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </SettingsSection>

      {/* Cache Settings */}
      <SettingsSection
        title="Cache Settings"
        description="Optimize performance with caching"
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableCache}
              onChange={(e) => handleInputChange({ target: { name: 'enableCache', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Caching</span>
          </label>

          {settings.enableCache && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cache Duration (minutes)</label>
              <input
                type="number"
                name="cacheDuration"
                value={settings.cacheDuration}
                onChange={handleInputChange}
                min="1"
                max="1440"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Maintenance Mode */}
      <SettingsSection
        title="Maintenance"
        description="Put the site in maintenance mode"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange({ target: { name: 'maintenanceMode', value: e.target.checked, type: 'checkbox' } })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Maintenance Mode</span>
          </label>

          {settings.maintenanceMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Message</label>
              <textarea
                name="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
}

/**
 * Settings Section Component
 */
function SettingsSection({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-secondary-700 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm mb-6">{description}</p>
      <div>{children}</div>
    </div>
  );
}

/**
 * Get settings from localStorage
 */
function getSettingsFromStorage() {
  const stored = localStorage.getItem('yatripati_settings');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const defaults = getDefaultSettings();
      return {
        ...defaults,
        ...parsed,
        sectionTitles: {
          ...defaults.sectionTitles,
          ...(parsed.sectionTitles || {}),
        },
        socialLinks: {
          ...defaults.socialLinks,
          ...(parsed.socialLinks || {}),
        },
        navigation: Array.isArray(parsed.navigation) ? parsed.navigation : defaults.navigation,
      };
    } catch {
      return getDefaultSettings();
    }
  }

  return getDefaultSettings();
}

/**
 * Save settings to localStorage
 */
function saveSettingsToStorage(settings) {
  localStorage.setItem('yatripati_settings', JSON.stringify(settings));
}

/**
 * Get default settings
 */
function getDefaultSettings() {
  return {
    siteName: 'Yatripati',
    siteDescription: 'The ultimate portal for Nepali news, tourism, and culture',
    siteUrl: 'https://yatripati.com',
    contactEmail: 'contact@yatripati.com',
    sectionTitles: {
      latest: 'ताजा समाचार',
      trending: 'विशेष सिफारिस',
      packages: 'प्याकेज समाचार',
      hospitality: 'हस्पिटालिटि',
      destination: 'गन्तव्य',
      hotels: 'होटल र रिसोर्ट'
    },
    navigation: [
      { label: 'होमपेज', path: '/', isCategory: false },
      {
        label: 'प्रदेश',
        path: '/category/pradesh',
        isCategory: true,
        hasDropdown: true,
        dropdownItems: [
          { label: 'प्रदेश १', path: '/category/pradesh-1' },
          { label: 'प्रदेश २', path: '/category/pradesh-2' },
          { label: 'प्रदेश ३', path: '/category/pradesh-3' },
          { label: 'प्रदेश ४', path: '/category/pradesh-4' },
          { label: 'प्रदेश ५', path: '/category/pradesh-5' },
          { label: 'प्रदेश ६', path: '/category/pradesh-6' },
          { label: 'प्रदेश ७', path: '/category/pradesh-7' },
        ],
      },
      { label: 'विचार', path: '/category/vichar', isCategory: true },
      { label: 'शिक्षा', path: '/category/shiksha', isCategory: true },
      { label: 'स्वास्थ्य', path: '/category/swasthya', isCategory: true },
      { label: 'खेलकुद', path: '/category/khel', isCategory: true },
      { label: 'अर्थतन्त्र', path: '/category/arthatantra', isCategory: true },
      { label: 'पर्यटन', path: '/category/tourism', isCategory: true },
      { label: 'प्रविधि', path: '/category/technology', isCategory: true },
    ],
    showComments: true,
    showAuthorBio: true,
    showViewCount: true,
    showSocialSharing: true,
    showRelatedArticles: true,
    enableSearch: true,
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    fontFamily: 'system',
    darkMode: true,
    socialLinks: {
      facebook: 'https://facebook.com/yatripati',
      twitter: 'https://twitter.com/yatripati',
      instagram: 'https://instagram.com/yatripati',
      youtube: 'https://youtube.com/@yatripati'
    },
    googleAnalyticsId: '',
    googleSearchConsole: '',
    metaKeywords: 'nepal news, tourism, travel, culture',
    useMockData: true,
    apiBaseUrl: 'https://api.yatripati.com',
    apiTimeout: 30,
    enableCache: true,
    cacheDuration: 60,
    maintenanceMode: false,
    maintenanceMessage: 'We are undergoing scheduled maintenance. Please check back soon.'
  };
}

export default SiteSettingsPage;
