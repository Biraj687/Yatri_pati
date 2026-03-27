import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Analytics Page - Dashboard metrics and analytics
 */
import { useEffect, useState } from 'react';
import { useDashboard } from '@context/DashboardContext';
import { useNotification } from '@context/NotificationContext';
export function AnalyticsPage() {
    const { stats, loadStats, loading } = useDashboard();
    const { showNotification } = useNotification();
    const [analytics, setAnalytics] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadStats();
                // Generate mock analytics data
                const dates = generateLast7Days();
                setAnalytics({
                    articleViews: dates.map(() => Math.floor(Math.random() * 1000) + 500),
                    articleClicks: dates.map(() => Math.floor(Math.random() * 500) + 200),
                    adImpressions: dates.map(() => Math.floor(Math.random() * 2000) + 1000),
                    adClicks: dates.map(() => Math.floor(Math.random() * 300) + 100),
                    dates,
                });
                showNotification('Analytics loaded successfully', 'success');
            }
            catch (error) {
                showNotification(error.message, 'error');
            }
        };
        fetchData();
    }, [loadStats, showNotification]);
    if (loading) {
        return _jsx(LoadingSkeletons, {});
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Analytics" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Track your dashboard performance metrics" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(MetricCard, { title: "Total Articles", value: stats?.totalArticles ?? 0, change: "+12%", color: "blue" }), _jsx(MetricCard, { title: "Published", value: stats?.publishedArticles ?? 0, change: "+8%", color: "green" }), _jsx(MetricCard, { title: "Total Views", value: stats?.totalViews ?? 0, change: "+23%", color: "purple" }), _jsx(MetricCard, { title: "Active Authors", value: stats?.totalAuthors ?? 0, change: "+2%", color: "orange" })] }), analytics && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Article Views (7 days)" }), _jsx(BarChart, { data: analytics.articleViews, dates: analytics.dates })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Ad Impressions (7 days)" }), _jsx(BarChart, { data: analytics.adImpressions, dates: analytics.dates, color: "orange" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Article Click Rate" }), _jsx(LineChart, { data: analytics.articleClicks })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Ad Click Performance" }), _jsx(LineChart, { data: analytics.adClicks, color: "green" })] })] })), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Recent Articles" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Title" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Views" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Published" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: stats?.recentArticles.slice(0, 5).map(article => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: article.title }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: article.views ?? 0 }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(article.publishedAt || article.createdAt).toLocaleDateString() })] }, article.id))) })] }) })] })] }));
}
// Helper Components
function MetricCard({ title, value, change, color, }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };
    return (_jsxs("div", { className: `${colors[color]} rounded-lg p-6`, children: [_jsx("p", { className: "text-sm font-medium opacity-75", children: title }), _jsx("p", { className: "text-3xl font-bold mt-2", children: value.toLocaleString() }), _jsxs("p", { className: "text-xs font-semibold mt-2", children: [change, " vs last month"] })] }));
}
function BarChart({ data, dates, color = 'blue', }) {
    const max = Math.max(...data);
    const colorClass = {
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        green: 'bg-green-500',
    }[color];
    return (_jsx("div", { className: "flex items-end justify-between gap-2 h-64", children: data.map((value, idx) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-full flex flex-col-reverse", children: _jsx("div", { className: `w-full ${colorClass} rounded-t`, style: { height: `${(value / max) * 200}px` }, title: `${value}` }) }), _jsx("span", { className: "text-xs text-gray-500", children: dates[idx].split('-')[2] })] }, idx))) }));
}
function LineChart({ data, color = 'purple', }) {
    const max = Math.max(...data);
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - (v / max) * 100,
    }));
    const colorClass = {
        purple: 'stroke-purple-500',
        green: 'stroke-green-500',
    }[color];
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return (_jsx("div", { className: "h-64", children: _jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", preserveAspectRatio: "none", children: [[0, 25, 50, 75, 100].map(y => (_jsx("line", { x1: "0", y1: y, x2: "100", y2: y, stroke: "#f3f4f6", strokeWidth: "0.5" }, y))), _jsx("path", { d: pathD, fill: "none", className: colorClass, strokeWidth: "1.5" }), points.map((p, i) => (_jsx("circle", { cx: p.x, cy: p.y, r: "1.5", fill: "#6366f1" }, i)))] }) }));
}
function LoadingSkeletons() {
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [1, 2, 3, 4].map(i => (_jsx("div", { className: "bg-gray-200 rounded-lg h-24 animate-pulse" }, i))) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [1, 2].map(i => (_jsx("div", { className: "bg-gray-200 rounded-lg h-64 animate-pulse" }, i))) })] }));
}
function generateLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}
