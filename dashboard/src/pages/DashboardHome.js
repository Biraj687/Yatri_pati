import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { FiFileText, FiEye, FiUsers, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { useDashboard } from '@context/DashboardContext';
import { LoadingSpinner, Card, Alert, Button } from '@components';
import { NewsCardPreview } from '@components';
import { formatNumberCompact } from '@utils';
export function DashboardHome() {
    const { stats, loadStats, loading, error, clearError } = useDashboard();
    useEffect(() => {
        loadStats();
    }, [loadStats]);
    const handleRetry = () => {
        clearError();
        loadStats();
    };
    // Show loading spinner only when loading and no stats yet
    if (loading && !stats) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx(LoadingSpinner, {}) }));
    }
    // Show error state
    if (error && !stats) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-96 space-y-4", children: [_jsx(Alert, { type: "error", message: error }), _jsxs(Button, { variant: "primary", onClick: handleRetry, className: "gap-2", children: [_jsx(FiRefreshCw, { size: 18 }), "Retry"] })] }));
    }
    // Fallback mock stats for development when stats is null (should not happen)
    const safeStats = stats || {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        totalViews: 0,
        totalAuthors: 0,
        recentArticles: [],
    };
    const statCards = [
        {
            icon: FiFileText,
            label: 'Total Articles',
            value: safeStats.totalArticles,
            color: 'bg-blue-50 text-blue-600',
            borderColor: 'border-blue-200',
        },
        {
            icon: FiTrendingUp,
            label: 'Published',
            value: safeStats.publishedArticles,
            color: 'bg-green-50 text-green-600',
            borderColor: 'border-green-200',
        },
        {
            icon: FiFileText,
            label: 'Drafts',
            value: safeStats.draftArticles,
            color: 'bg-yellow-50 text-yellow-600',
            borderColor: 'border-yellow-200',
        },
        {
            icon: FiEye,
            label: 'Total Views',
            value: formatNumberCompact(safeStats.totalViews),
            color: 'bg-purple-50 text-purple-600',
            borderColor: 'border-purple-200',
        },
        {
            icon: FiUsers,
            label: 'Authors',
            value: safeStats.totalAuthors,
            color: 'bg-pink-50 text-pink-600',
            borderColor: 'border-pink-200',
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsx(Card, { className: `${stat.color} border ${stat.borderColor}`, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium opacity-75", children: stat.label }), _jsx(Icon, { size: 24, className: "opacity-50" })] }), _jsx("div", { className: "text-2xl font-bold", children: stat.value })] }) }, stat.label));
                }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Recent Articles" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: safeStats.recentArticles.slice(0, 6).map(article => (_jsx(NewsCardPreview, { article: article, compact: true }, article.id))) }), safeStats.recentArticles.length === 0 && (_jsxs(Card, { className: "p-12 text-center text-gray-500", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCED" }), _jsx("p", { children: "No articles yet. Start by creating your first article!" })] }))] }), _jsxs(Card, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-indigo-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Dashboard Snapshot" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 mb-1", children: "Publish Rate" }), _jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [safeStats.totalArticles > 0 ? Math.round((safeStats.publishedArticles / safeStats.totalArticles) * 100) : 0, "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 mb-1", children: "Avg. Views" }), _jsx("p", { className: "text-2xl font-bold text-indigo-600", children: safeStats.publishedArticles > 0 ? Math.round(safeStats.totalViews / safeStats.publishedArticles) : 0 })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 mb-1", children: "Active Authors" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: safeStats.totalAuthors })] })] })] })] }));
}
