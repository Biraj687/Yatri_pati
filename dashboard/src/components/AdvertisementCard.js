import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AdvertisementCard Component
 * Individual advertisement card for dashboard display
 */
import { useState } from 'react';
import { advertisementService } from '@shared/services';
export const AdvertisementCard = ({ advertisement, onEdit, onToggle, onDelete, }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this advertisement?'))
            return;
        setIsDeleting(true);
        try {
            const response = await advertisementService.deleteAdvertisement(advertisement.id);
            if (response.success) {
                onDelete?.();
            }
            else {
                alert(`Failed to delete: ${response.error}`);
            }
        }
        catch (error) {
            alert(`Error: ${error.message}`);
        }
        finally {
            setIsDeleting(false);
        }
    };
    const handleToggle = async () => {
        setIsToggling(true);
        try {
            const response = await advertisementService.toggleAdvertisement(advertisement.id);
            if (response.success) {
                onToggle?.();
            }
            else {
                alert(`Failed to toggle: ${response.error}`);
            }
        }
        catch (error) {
            alert(`Error: ${error.message}`);
        }
        finally {
            setIsToggling(false);
        }
    };
    return (_jsxs("div", { className: "bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition", children: [_jsx("div", { className: "aspect-video bg-gray-100 overflow-hidden", children: _jsx("img", { src: advertisement.imageUrl, alt: advertisement.title, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate", children: advertisement.title }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: advertisement.position })] }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${advertisement.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'}`, children: advertisement.isActive ? 'Active' : 'Inactive' })] }), advertisement.description && (_jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: advertisement.description })), _jsxs("div", { className: "grid grid-cols-2 gap-2 py-2 border-y text-xs", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Impressions" }), _jsx("p", { className: "font-semibold", children: advertisement.impressions || 0 })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Clicks" }), _jsx("p", { className: "font-semibold", children: advertisement.clicks || 0 })] })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { onClick: () => onEdit(advertisement), className: "flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition", children: "Edit" }), _jsx("button", { onClick: handleToggle, disabled: isToggling, className: `flex-1 px-3 py-1 text-sm rounded transition ${isToggling
                                    ? 'opacity-50 cursor-not-allowed'
                                    : advertisement.isActive
                                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'}`, children: isToggling ? '...' : advertisement.isActive ? 'Deactivate' : 'Activate' }), _jsx("button", { onClick: handleDelete, disabled: isDeleting, className: "flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed", children: isDeleting ? '...' : 'Delete' })] }), advertisement.linkUrl && (_jsx("div", { className: "pt-2 border-t", children: _jsx("a", { href: advertisement.linkUrl, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-blue-600 hover:underline truncate block", children: advertisement.linkUrl }) }))] })] }));
};
