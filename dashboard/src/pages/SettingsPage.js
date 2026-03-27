import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Settings Page - Dashboard configuration and settings
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dashboardSettingsSchema } from '@utils/validation';
import { useNotification } from '@context/NotificationContext';
const defaultSettings = {
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
    maintenanceMode: false,
    enableComments: true,
    postsPerPage: 10,
    timezone: 'UTC',
};
export function SettingsPage() {
    const [_settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const { register, handleSubmit, formState: { errors }, reset, } = useForm({
        resolver: zodResolver(dashboardSettingsSchema),
        defaultValues: defaultSettings,
    });
    useEffect(() => {
        // Load settings from backend or localStorage
        const savedSettings = localStorage.getItem('dashboardSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
                reset(parsed);
            }
            catch (e) {
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
            setSettings(data);
            showNotification('Settings saved successfully!', 'success');
        }
        catch (error) {
            showNotification(error.message, 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard Settings" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Configure your dashboard and site preferences" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsx(Section, { title: "General Settings", description: "Basic site information", children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormGroup, { label: "Site Name", error: errors.siteName?.message, children: _jsx("input", { ...register('siteName'), type: "text", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "Site Description", error: errors.siteDescription?.message, children: _jsx("textarea", { ...register('siteDescription'), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", rows: 3 }) }), _jsx(FormGroup, { label: "Site URL", error: errors.siteUrl?.message, children: _jsx("input", { ...register('siteUrl'), type: "url", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "Logo URL", error: errors.logoUrl?.message, children: _jsx("input", { ...register('logoUrl'), type: "url", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) })] }) }), _jsx(Section, { title: "Social Media", description: "Connect your social profiles", children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormGroup, { label: "Facebook", error: errors.socialLinks?.facebook?.message, children: _jsx("input", { ...register('socialLinks.facebook'), type: "url", placeholder: "https://facebook.com/...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "Twitter", error: errors.socialLinks?.twitter?.message, children: _jsx("input", { ...register('socialLinks.twitter'), type: "url", placeholder: "https://twitter.com/...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "Instagram", error: errors.socialLinks?.instagram?.message, children: _jsx("input", { ...register('socialLinks.instagram'), type: "url", placeholder: "https://instagram.com/...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "LinkedIn", error: errors.socialLinks?.linkedin?.message, children: _jsx("input", { ...register('socialLinks.linkedin'), type: "url", placeholder: "https://linkedin.com/...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) })] }) }), _jsx(Section, { title: "Content Settings", description: "Control content behavior", children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormGroup, { label: "Posts Per Page", error: errors.postsPerPage?.message, children: _jsx("input", { ...register('postsPerPage', { valueAsNumber: true }), type: "number", min: "1", max: "100", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }) }), _jsx(FormGroup, { label: "Timezone", error: errors.timezone?.message, children: _jsxs("select", { ...register('timezone'), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { children: "UTC" }), _jsx("option", { children: "EST" }), _jsx("option", { children: "CST" }), _jsx("option", { children: "MST" }), _jsx("option", { children: "PST" })] }) }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { ...register('enableComments'), type: "checkbox", className: "w-4 h-4 rounded border-gray-300" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Enable Comments" })] }) }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { ...register('maintenanceMode'), type: "checkbox", className: "w-4 h-4 rounded border-gray-300" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Maintenance Mode" })] }) })] }) }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: loading, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition", children: loading ? 'Saving...' : 'Save Settings' }), _jsx("button", { type: "button", onClick: () => reset(), className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition", children: "Reset" })] })] })] }));
}
function Section({ title, description, children }) {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: description })] }), children] }));
}
function FormGroup({ label, error, children }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label }), children, error && _jsx("p", { className: "text-red-600 text-xs mt-1", children: error })] }));
}
