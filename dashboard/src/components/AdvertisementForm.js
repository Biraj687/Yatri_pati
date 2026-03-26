import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AdvertisementForm Component
 * Form for creating and editing advertisements
 */
import { useState } from 'react';
import { advertisementService } from '@shared/services';
export const AdvertisementForm = ({ initialData, onSubmitSuccess, onCancel, }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
        linkUrl: initialData?.linkUrl || '',
        position: initialData?.position || 'inline',
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            let response;
            if (initialData?.id) {
                // Update existing
                response = await advertisementService.updateAdvertisement(initialData.id, {
                    ...formData,
                    id: initialData.id,
                });
            }
            else {
                // Create new
                response = await advertisementService.createAdvertisement(formData);
            }
            if (response.success) {
                onSubmitSuccess?.();
            }
            else {
                setError(response.error || 'Failed to save advertisement');
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title *" }), _jsx("input", { type: "text", name: "title", value: formData.title, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Advertisement title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description || '', onChange: handleChange, rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Optional description" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Image URL *" }), _jsx("input", { type: "url", name: "imageUrl", value: formData.imageUrl, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "https://example.com/image.jpg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Link URL *" }), _jsx("input", { type: "url", name: "linkUrl", value: formData.linkUrl, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "https://example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Position *" }), _jsxs("select", { name: "position", value: formData.position, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "hero", children: "Hero Section" }), _jsx("option", { value: "sidebar", children: "Sidebar" }), _jsx("option", { value: "inline", children: "Inline (Between Articles)" }), _jsx("option", { value: "footer", children: "Footer" }), _jsx("option", { value: "fullwidth", children: "Full Width" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx("input", { type: "date", name: "startDate", value: formData.startDate || '', onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx("input", { type: "date", name: "endDate", value: formData.endDate || '', onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsx("div", { children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "isActive", checked: formData.isActive || false, onChange: handleChange, className: "w-4 h-4 border border-gray-300 rounded" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Active" })] }) }), _jsxs("div", { className: "flex gap-2 pt-4", children: [_jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create' }), _jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition", children: "Cancel" })] })] }));
};
