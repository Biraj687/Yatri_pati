import { useState } from 'react';
import { Card, Button, Input, Alert } from '@components';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: localStorage.getItem('siteName') || 'Yatripati News Portal',
    defaultAuthor: localStorage.getItem('defaultAuthor') || 'Yatripati',
    postsPerPage: parseInt(localStorage.getItem('postsPerPage') || '20'),
    autoSave: localStorage.getItem('autoSave') !== 'false',
    darkMode: localStorage.getItem('darkMode') === 'true',
    emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
    theme: localStorage.getItem('theme') || 'light',
  });

  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
    });
    setSaveMessage({ type: 'success', message: 'Settings saved successfully!' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage dashboard preferences and configuration</p>
      </div>

      {/* Alerts */}
      {saveMessage && (
        <Alert
          type={saveMessage.type}
          message={saveMessage.message}
          onClose={() => setSaveMessage(null)}
          dismissible
        />
      )}

      {/* General Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="space-y-4">
          <Input
            label="Site Name"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('siteName', e.target.value)}
            placeholder="Your site name"
          />
          <Input
            label="Default Author"
            value={settings.defaultAuthor}
            onChange={(e) => handleSettingChange('defaultAuthor', e.target.value)}
            placeholder="Default author name"
            helperText="Used when no specific author is selected"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posts Per Page</label>
            <input
              type="number"
              value={settings.postsPerPage}
              onChange={(e) => handleSettingChange('postsPerPage', parseInt(e.target.value))}
              min="5"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Number of articles to display per page</p>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-600">Enable dark theme for the dashboard</p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System Preference)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto Save</p>
              <p className="text-sm text-gray-600">Automatically save drafts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>
        </div>
      </Card>

      {/* API Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-xs font-mono text-gray-600">API Endpoint</p>
            <p className="text-sm font-medium text-gray-900 mt-1">http://localhost:3000/api</p>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-600">Auth Token Status</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {localStorage.getItem('authToken') ? '✅ Active' : '⚠️ Not Set'}
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About Dashboard</h2>
        <p className="text-sm text-gray-600">
          Yatripati News Management Dashboard v1.0.0
        </p>
        <p className="text-xs text-gray-500 mt-3">
          Built with React, TypeScript, and Tailwind CSS
        </p>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
