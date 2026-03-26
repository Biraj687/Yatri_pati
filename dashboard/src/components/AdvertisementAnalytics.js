import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAdvertisementAnalytics } from '@shared/hooks';
export const AdvertisementAnalytics = () => {
    const analyticsState = useAdvertisementAnalytics();
    if (analyticsState.loading && !analyticsState.data) {
        return (_jsx("div", { className: "animate-pulse bg-gray-200 h-64 rounded" }));
    }
    if (analyticsState.error) {
        return (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: [_jsx("p", { className: "font-semibold", children: "Error" }), _jsx("p", { className: "text-sm", children: analyticsState.error })] }));
    }
    const data = analyticsState.data;
    if (!data) {
        return (_jsx("div", { className: "p-4 bg-gray-50 rounded-lg text-center text-gray-600", children: "No analytics data available" }));
    }
    const totalImpressions = data.totalImpressions ?? 0;
    const totalClicks = data.totalClicks ?? 0;
    const ctr = ((totalClicks / totalImpressions) * 100 || 0).toFixed(2);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Impressions" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: totalImpressions.toLocaleString() })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Clicks" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: totalClicks.toLocaleString() })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Click-Through Rate" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: [ctr, "%"] })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Active Ads" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: (data.topAds?.length ?? 0) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "p-4 border-b", children: _jsx("h3", { className: "text-lg font-semibold", children: "Top Performing Advertisements" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Title" }), _jsx("th", { className: "px-4 py-3 text-right text-sm font-semibold text-gray-700", children: "Impressions" }), _jsx("th", { className: "px-4 py-3 text-right text-sm font-semibold text-gray-700", children: "Clicks" }), _jsx("th", { className: "px-4 py-3 text-right text-sm font-semibold text-gray-700", children: "CTR" })] }) }), _jsx("tbody", { className: "divide-y", children: data.topAds?.map(ad => {
                                        const adImpressions = ad?.impressions ?? 0;
                                        const adClicks = ad?.clicks ?? 0;
                                        const adCtr = ((adClicks / adImpressions) * 100 || 0).toFixed(2);
                                        return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: ad?.title }), _jsx("td", { className: "px-4 py-3 text-right text-gray-600", children: adImpressions.toLocaleString() }), _jsx("td", { className: "px-4 py-3 text-right text-gray-600", children: adClicks.toLocaleString() }), _jsxs("td", { className: "px-4 py-3 text-right text-gray-600", children: [adCtr, "%"] })] }, ad?.id));
                                    }) })] }) })] })] }));
};
