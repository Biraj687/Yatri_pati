import { FiEye, FiCalendar, FiUser } from 'react-icons/fi';
import type { NewsArticle } from '@types';

interface NewsCardPreviewProps {
  article: NewsArticle;
  compact?: boolean;
}

export function NewsCardPreview({ article, compact = false }: NewsCardPreviewProps) {
  const truncateText = (text: string, length: number) => {
    if (text.length > length) return text.substring(0, length) + '...';
    return text;
  };

  const getStatusBadgeColor = (status: string) => {
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
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
        {article.featured_image && (
          <div className="h-32 bg-gray-100 overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h4 className="font-semibold text-sm text-gray-900 flex-1 line-clamp-2">
              {truncateText(article.title, 50)}
            </h4>
            <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(article.status)}`}>
              {article.status}
            </span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {truncateText(article.excerpt || article.content, 80)}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {article.views && (
                <span className="flex items-center gap-1">
                  <FiEye size={14} />
                  {article.views}
                </span>
              )}
            </div>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      {article.featured_image && (
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="font-bold text-gray-900 flex-1 line-clamp-2">
            {article.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(article.status)}`}>
            {article.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {article.excerpt || article.content}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <FiCalendar size={14} />
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FiEye size={14} />
            {article.views || 0} views
          </span>
        </div>

        {article.authors && article.authors.length > 0 && (
          <div className="flex items-center gap-2 text-xs pt-3 border-t border-gray-200">
            <FiUser size={14} />
            <span className="text-gray-600">{article.authors[0].name || 'Unknown'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
