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
  }, {} as Record<string, number>);

  const topArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const topAuthors = articles.reduce((acc, article) => {
    article.authors.forEach(author => {
      acc[author.name] = (acc[author.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Overview of your news portal performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Articles</h3>
          <p className="text-3xl font-bold text-gray-900">{totalArticles}</p>
          <p className="text-xs text-gray-500 mt-2">{publishedArticles} published • {draftArticles} drafts</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-blue-600">{formatNumberCompact(totalViews)}</p>
          <p className="text-xs text-gray-500 mt-2">{formatNumberCompact(avgViews)} avg per article</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Featured Articles</h3>
          <p className="text-3xl font-bold text-yellow-600">{stickyArticles}</p>
          <p className="text-xs text-gray-500 mt-2">{((stickyArticles / totalArticles) * 100 || 0).toFixed(1)}% of total</p>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles by Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                    <span className="text-sm font-bold text-gray-700">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(count / totalArticles) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Top Authors */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h2>
          <div className="space-y-3">
            {Object.entries(topAuthors)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([author, count]) => (
                <div key={author}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{author}</span>
                    <span className="text-sm font-bold text-gray-700">{count} articles</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(count / (Math.max(...Object.values(topAuthors)))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Top Articles */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Articles</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Title</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Views</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topArticles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm text-gray-900 font-medium">{article.title.substring(0, 50)}</td>
                  <td className="py-3 px-3 text-sm font-bold text-blue-600">{formatNumberCompact(article.views || 0)}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 border-indigo-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Publish Rate</p>
            <p className="text-2xl font-bold text-blue-600">{totalArticles > 0 ? Math.round((publishedArticles / totalArticles) * 100) : 0}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Avg. Views/Article</p>
            <p className="text-2xl font-bold text-indigo-600">{formatNumberCompact(avgViews)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Authors</p>
            <p className="text-2xl font-bold text-purple-600">{Object.keys(topAuthors).length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-bold text-pink-600">{Object.keys(categoryStats).length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
