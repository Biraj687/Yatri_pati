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
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Alert type="error" message={error} />
        <Button variant="primary" onClick={handleRetry} className="gap-2">
          <FiRefreshCw size={18} />
          Retry
        </Button>
      </div>
    );
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

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.color} border ${stat.borderColor}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium opacity-75">{stat.label}</span>
                  <Icon size={24} className="opacity-50" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeStats.recentArticles.slice(0, 6).map(article => (
            <NewsCardPreview key={article.id} article={article} compact />
          ))}
        </div>
        {safeStats.recentArticles.length === 0 && (
          <Card className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No articles yet. Start by creating your first article!</p>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Publish Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {safeStats.totalArticles > 0 ? Math.round((safeStats.publishedArticles / safeStats.totalArticles) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Avg. Views</p>
            <p className="text-2xl font-bold text-indigo-600">
              {safeStats.publishedArticles > 0 ? Math.round(safeStats.totalViews / safeStats.publishedArticles) : 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Active Authors</p>
            <p className="text-2xl font-bold text-purple-600">{safeStats.totalAuthors}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
