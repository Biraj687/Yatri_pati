import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAdvertisements } from '@shared/hooks';
import { AdvertisementList } from '../components/AdvertisementList';
import { AdvertisementAnalytics } from '../components/AdvertisementAnalytics';
export const AdvertisementManagementPage = () => {
    const advertisements = useAdvertisements({ page: 1, limit: 12 });
    const handleRefresh = () => {
        advertisements.refetch();
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Advertisement Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Manage advertisements displayed across the portal and track their performance" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Performance Analytics" }), _jsx("button", { onClick: handleRefresh, className: "px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition", children: "Refresh" })] }), _jsx(AdvertisementAnalytics, {})] }), _jsx("div", { className: "bg-white p-6 rounded-lg", children: _jsx(AdvertisementList, { advertisements: advertisements, onCreateSuccess: handleRefresh, onUpdateSuccess: handleRefresh, onDeleteSuccess: handleRefresh, onToggleSuccess: handleRefresh }) })] }));
};
export default AdvertisementManagementPage;
