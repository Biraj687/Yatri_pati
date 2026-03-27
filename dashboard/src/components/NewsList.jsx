import { FiEdit2, FiTrash2, FiEye, FiStar } from 'react-icons/fi';
import type { NewsArticle } from '@types';
import { formatDate, truncate, formatNumberCompact } from '@utils';
import { Badge, Button } from './UI';



export function NewsList({ articles, onEdit, onDelete, onToggleSticky, onPublish, loading, onRowClick }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author(s)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 ? (
              
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onRowClick?.(article)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {article.sticky && <FiStar size={16} className="text-yellow-500" />}
                      <div className="font-medium text-gray-900 max-w-xs">{truncate(article.title, 40)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {article.authors.map(a => a.name).join(', ') || 'Yatripati'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={article.status === 'draft' ? 'warning' : article.status === 'published' ? 'success' : 'info'}>
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(article.updatedAt || article.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiEye size={16} />
                      <span className="text-sm">{formatNumberCompact(article.views || 0)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {article.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onPublish(article.id)}
                          className="text-xs"
                        >
                          Publish
                        </Button>
                      )}
                      <button
                        onClick={() => onToggleSticky(article.id)}
                        className={`p-2 rounded hover:bg-gray-100 ${article.sticky ? 'text-yellow-500' : 'text-gray-400'}`}
                        title={article.sticky ? 'Remove sticky' : 'Make sticky'}
                      >
                        <FiStar size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(article)}
                        className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(article.id)}
                        className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export function NewsCardPreview({ article, compact = false }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {article.featured_image && (
        <div className="relative w-full bg-gray-200">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target ).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {article.sticky && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <FiStar size={12} /> Sticky
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info" size="sm">{article.category || 'General'}</Badge>
          <Badge variant={article.status === 'draft' ? 'warning' : 'success'} size="sm">{article.status}</Badge>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
        {!compact && article.excerpt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          {formatDate(article.createdAt)}</span>
          <div className="flex items-center gap-1">
            <FiEye size={14} />
            {formatNumberCompact(article.views || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}

