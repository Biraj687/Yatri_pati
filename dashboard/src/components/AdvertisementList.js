import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AdvertisementList Component
 * Displays all advertisements with CRUD operations
 */
import { useState } from 'react';
import { AdvertisementCard } from './AdvertisementCard';
import { AdvertisementForm } from './AdvertisementForm';
export const AdvertisementList = ({ advertisements, onCreateSuccess, onUpdateSuccess, onDeleteSuccess, onToggleSuccess, }) => {
    const [selectedAd, setSelectedAd] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { data, loading, error } = advertisements;
    if (loading && !data) {
        return (_jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => (_jsx("div", { className: "animate-pulse bg-gray-200 h-48 rounded" }, i))) }));
    }
    if (error) {
        return (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: [_jsx("p", { className: "font-semibold", children: "Error" }), _jsx("p", { className: "text-sm", children: error })] }));
    }
    const adsList = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const currentPage = data?.page ?? 1;
    if (adsList.length === 0) {
        return (_jsxs("div", { className: "p-8 bg-gray-50 rounded-lg text-center", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "No Advertisements" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "No advertisements found. Create one to get started." }), _jsx("button", { onClick: () => {
                        setSelectedAd(null);
                        setShowForm(true);
                    }, className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", children: "Create Advertisement" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Advertisements" }), _jsx("button", { onClick: () => {
                            setSelectedAd(null);
                            setShowForm(true);
                        }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", children: "+ New Advertisement" })] }), showForm && (_jsxs("div", { className: "bg-gray-50 p-6 rounded-lg border", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: selectedAd ? 'Edit Advertisement' : 'Create Advertisement' }), _jsx(AdvertisementForm, { initialData: selectedAd || undefined, onSubmitSuccess: () => {
                            setShowForm(false);
                            if (selectedAd) {
                                onUpdateSuccess?.();
                            }
                            else {
                                onCreateSuccess?.();
                            }
                        }, onCancel: () => setShowForm(false) })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: adsList.map(ad => (_jsx(AdvertisementCard, { advertisement: ad, onEdit: (updatedAd) => {
                        setSelectedAd(updatedAd);
                        setShowForm(true);
                    }, onToggle: onToggleSuccess, onDelete: onDeleteSuccess }, ad.id))) }), totalPages > 1 && (_jsxs("div", { className: "text-center text-gray-600", children: ["Page ", currentPage, " of ", totalPages] }))] }));
};
