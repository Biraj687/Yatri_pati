/**
 * Settings Page - Dashboard configuration and settings
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dashboardSettingsSchema, type DashboardSettingsInput } from '@utils/validation';
import { useNotification } from '@context/NotificationContext';
import type { DashboardSettings } from '@types';

const defaultSettings: DashboardSettings = {
  siteName: 'Yatripati Dashboard',
  siteDescription: 'Manage your news and advertisements',
  siteUrl: 'https://yatripati.com',
  logoUrl: 'https://via.placeholder.com/150',
  socialLinks: {
    facebook: 'https://facebook.com/yatripati',
    twitter: 'https://twitter.com/yatripati',
    instagram: 'https://instagram.com/yatripati',
    linkedin: 'https://linkedin.com/company/yatripati',
  },
  maintenanceMode,
  enableComments,
  postsPerPage,
  timezone: 'UTC',
};

export function SettingsPage() {
  const [_settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(dashboardSettingsSchema),
    defaultValues,
  });

  useEffect(() => {
    // Load settings from backend or localStorage
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        reset(parsed );
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await dashboardService.updateSettings(data);
      
      // For now, save to localStorage
      localStorage.setItem('dashboardSettings', JSON.stringify(data));
      setSettings(data );
      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      showNotification((error ).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Settings</h1>
        <p className="text-gray-600 mt-2">Configure your dashboard and site preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Settings */}
        <Section title="General Settings" description="Basic site information">
          <div className="space-y-4">
            <FormGroup label="Site Name" error={errors.siteName?.message}>
              <input
                {...register('siteName')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="Site Description" error={errors.siteDescription?.message}>
              <textarea
                {...register('siteDescription')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </FormGroup>

            <FormGroup label="Site URL" error={errors.siteUrl?.message}>
              <input
                {...register('siteUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="Logo URL" error={errors.logoUrl?.message}>
              <input
                {...register('logoUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social Media" description="Connect your social profiles">
          <div className="space-y-4">
            <FormGroup label="Facebook" error={errors.socialLinks?.facebook?.message}>
              <input
                {...register('socialLinks.facebook')}
                type="url"
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="Twitter" error={errors.socialLinks?.twitter?.message}>
              <input
                {...register('socialLinks.twitter')}
                type="url"
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="Instagram" error={errors.socialLinks?.instagram?.message}>
              <input
                {...register('socialLinks.instagram')}
                type="url"
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="LinkedIn" error={errors.socialLinks?.linkedin?.message}>
              <input
                {...register('socialLinks.linkedin')}
                type="url"
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
          </div>
        </Section>

        {/* Content Settings */}
        <Section title="Content Settings" description="Control content behavior">
          <div className="space-y-4">
            <FormGroup label="Posts Per Page" error={errors.postsPerPage?.message}>
              <input
                {...register('postsPerPage', { valueAsNumber: true })}
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="Timezone" error={errors.timezone?.message}>
              <select
                {...register('timezone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                UTC</option>
                EST</option>
                CST</option>
                MST</option>
                PST</option>
              </select>
            </FormGroup>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('enableComments')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Enable Comments</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('maintenanceMode')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
              </label>
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper Components



function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}



function FormGroup({ label, error, children }) {
  return (
    
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

