import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDashboard } from '@context';
import { Card } from '@components';
import { formatNumberCompact } from '@utils';
export function AnalyticsPage() {
    const { articles, stats: _stats } = useDashboard();
    // Calculate analytics
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const draftArticles = articles.filter(a => a.status === 'draft').length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const avgViews = publishedArticles > 0 ? Math.round(totalViews / publishedArticles) : 0;
    const stickyArticles = articles.filter(a => a.sticky).length;
    const categoryStats = articles.reduce((acc, article) => {
        const category = article.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    const topArticles = [...articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);
    const topAuthors = articles.reduce((acc, article) => {
        article.authors.forEach(author => {
            acc[author.name] = (acc[author.name] || 0) + 1;
        });
        return acc;
    }, {});
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Analytics & Insights" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Overview of your news portal performance" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-600 mb-2", children: "Total Articles" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: totalArticles }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [publishedArticles, " published \u2022 ", draftArticles, " drafts"] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-600 mb-2", children: "Total Views" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: formatNumberCompact(totalViews) }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [formatNumberCompact(avgViews), " avg per article"] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-600 mb-2", children: "Featured Articles" }), _jsx("p", { className: "text-3xl font-bold text-yellow-600", children: stickyArticles }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [((stickyArticles / totalArticles) * 100 || 0).toFixed(1), "% of total"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Articles by Category" }), _jsx("div", { className: "space-y-3", children: Object.entries(categoryStats)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([category, count]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: category }), _jsx("span", { className: "text-sm font-bold text-gray-700", children: count })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all", style: {
                                                    width: `${(count / totalArticles) * 100}%`,
                                                } }) })] }, category))) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Top Contributors" }), _jsx("div", { className: "space-y-3", children: Object.entries(topAuthors)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 8)
                                    .map(([author, count]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: author }), _jsxs("span", { className: "text-sm font-bold text-gray-700", children: [count, " articles"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-purple-600 h-2 rounded-full transition-all", style: {
                                                    width: `${(count / (Math.max(...Object.values(topAuthors)))) * 100}%`,
                                                } }) })] }, author))) })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Top Performing Articles" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "text-left py-2 px-3 text-xs font-semibold text-gray-600", children: "Title" }), _jsx("th", { className: "text-left py-2 px-3 text-xs font-semibold text-gray-600", children: "Views" }), _jsx("th", { className: "text-left py-2 px-3 text-xs font-semibold text-gray-600", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: topArticles.map(article => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "py-3 px-3 text-sm text-gray-900 font-medium", children: article.title.substring(0, 50) }), _jsx("td", { className: "py-3 px-3 text-sm font-bold text-blue-600", children: formatNumberCompact(article.views || 0) }), _jsx("td", { className: "py-3 px-3", children: _jsx("span", { className: `text-xs font-semibold px-2 py-1 rounded-full ${article.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'}`, children: article.status }) })] }, article.id))) })] }) })] }), _jsxs(Card, { className: "bg-gradient-to-br from-indigo-50 to-blue-50 p-6 border-indigo-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Performance Summary" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Publish Rate" }), _jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [totalArticles > 0 ? Math.round((publishedArticles / totalArticles) * 100) : 0, "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Avg. Views/Article" }), _jsx("p", { className: "text-2xl font-bold text-indigo-600", children: formatNumberCompact(avgViews) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Authors" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: Object.keys(topAuthors).length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Categories" }), _jsx("p", { className: "text-2xl font-bold text-pink-600", children: Object.keys(categoryStats).length })] })] })] })] }));
}
