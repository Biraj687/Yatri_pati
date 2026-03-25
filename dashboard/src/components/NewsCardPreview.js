import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiEye, FiCalendar, FiUser } from 'react-icons/fi';
export function NewsCardPreview({ article, compact = false }) {
    const truncateText = (text, length) => {
        if (text.length > length)
            return text.substring(0, length) + '...';
        return text;
    };
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };
    if (compact) {
        return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden", children: [article.featured_image && (_jsx("div", { className: "h-32 bg-gray-100 overflow-hidden", children: _jsx("img", { src: article.featured_image, alt: article.title, className: "w-full h-full object-cover" }) })), _jsxs("div", { className: "p-3", children: [_jsxs("div", { className: "flex items-start justify-between mb-2 gap-2", children: [_jsx("h4", { className: "font-semibold text-sm text-gray-900 flex-1 line-clamp-2", children: truncateText(article.title, 50) }), _jsx("span", { className: `text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(article.status)}`, children: article.status })] }), _jsx("p", { className: "text-xs text-gray-600 line-clamp-2 mb-3", children: truncateText(article.excerpt || article.content, 80) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsx("div", { className: "flex items-center gap-3", children: article.views && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiEye, { size: 14 }), article.views] })) }), _jsx("span", { children: new Date(article.createdAt).toLocaleDateString() })] })] })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow", children: [article.featured_image && (_jsx("div", { className: "h-40 bg-gray-100 overflow-hidden", children: _jsx("img", { src: article.featured_image, alt: article.title, className: "w-full h-full object-cover hover:scale-105 transition-transform" }) })), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3 gap-2", children: [_jsx("h3", { className: "font-bold text-gray-900 flex-1 line-clamp-2", children: article.title }), _jsx("span", { className: `text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(article.status)}`, children: article.status })] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-3 mb-4", children: article.excerpt || article.content }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 mb-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiCalendar, { size: 14 }), new Date(article.createdAt).toLocaleDateString()] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiEye, { size: 14 }), article.views || 0, " views"] })] }), article.authors && article.authors.length > 0 && (_jsxs("div", { className: "flex items-center gap-2 text-xs pt-3 border-t border-gray-200", children: [_jsx(FiUser, { size: 14 }), _jsx("span", { className: "text-gray-600", children: article.authors[0].name || 'Unknown' })] }))] })] }));
}
