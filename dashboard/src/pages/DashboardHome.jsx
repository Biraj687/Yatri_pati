import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiUsers,
  FiRefreshCw,
  FiAward,
  FiArrowRight,
} from 'react-icons/fi';
import { useDashboard } from '@context/DashboardContext';
import { useAdvertisementAnalytics } from '@shared/hooks';
import { LoadingSpinner, Card, Alert, Button } from '@components';
import { NewsCardPreview } from '@components';
import { formatNumberCompact } from '@utils';

const EMPTY_STATS = {
  totalArticles: 0,
  publishedArticles: 0,
  draftArticles: 0,
  totalViews: 0,
  totalAuthors: 0,
  recentArticles: [],
};

export function DashboardHome() {
  const { stats, loadStats, loading, error, clearError } = useDashboard();
  const adAnalytics = useAdvertisementAnalytics();

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
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Alert variant="error">{error}</Alert>
        <Button variant="primary" onClick={handleRetry} className="gap-2">
          <FiRefreshCw size={18} />
          Retry
        </Button>
      </div>
    );
  }

  const safeStats = stats || EMPTY_STATS;

  const statCards = [
    {
      icon: FiFileText,
      label: 'Total Articles',
      value: safeStats.totalArticles,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: FiCheckCircle,
      label: 'Published',
      value: safeStats.publishedArticles,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: FiEdit3,
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

  const publishRate =
    safeStats.totalArticles > 0
      ? Math.round((safeStats.publishedArticles / safeStats.totalArticles) * 100)
      : 0;

  const avgViews =
    safeStats.publishedArticles > 0
      ? Math.round(safeStats.totalViews / safeStats.publishedArticles)
      : 0;

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
                  <Icon size={22} className="opacity-50" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Articles</h2>
          <Link
            to="/news"
            className="flex items-center gap-1 text-sm font-medium text-[#ea0031] hover:text-[#c9002a]"
          >
            View all <FiArrowRight size={16} />
          </Link>
        </div>
        {safeStats.recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeStats.recentArticles.slice(0, 6).map((article) => (
              <NewsCardPreview key={article.id} article={article} compact />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No articles yet. Start by creating your first article!</p>
            <Link to="/news">
              <Button variant="primary" className="mt-4">
                Create Article
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Publish Rate</p>
            <p className="text-2xl font-bold text-blue-600">{publishRate}%</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Avg. Views per Article</p>
            <p className="text-2xl font-bold text-indigo-600">{avgViews}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Active Authors</p>
            <p className="text-2xl font-bold text-purple-600">{safeStats.totalAuthors}</p>
          </div>
        </div>
      </Card>

      {/* Advertisement Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiAward size={22} className="text-orange-600" />
            Advertisement Performance
          </h2>
          <Link
            to="/advertisements"
            className="flex items-center gap-1 text-sm font-medium text-[#ea0031] hover:text-[#c9002a]"
          >
            Manage Ads <FiArrowRight size={16} />
          </Link>
        </div>
        {adAnalytics.loading ? (
          <Card className="p-8 flex items-center justify-center">
            <LoadingSpinner />
          </Card>
        ) : adAnalytics.error ? (
          <Alert variant="error">{adAnalytics.error}</Alert>
        ) : adAnalytics.data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-orange-50 border-orange-200 p-6">
              <div className="text-orange-600 text-sm font-medium mb-2">Total Impressions</div>
              <div className="text-3xl font-bold text-orange-900">
                {formatNumberCompact(adAnalytics.data?.totalImpressions ?? 0)}
              </div>
            </Card>
            <Card className="bg-amber-50 border-amber-200 p-6">
              <div className="text-amber-600 text-sm font-medium mb-2">Total Clicks</div>
              <div className="text-3xl font-bold text-amber-900">
                {formatNumberCompact(adAnalytics.data?.totalClicks ?? 0)}
              </div>
            </Card>
            <Card className="bg-red-50 border-red-200 p-6">
              <div className="text-red-600 text-sm font-medium mb-2">Click-Through Rate</div>
              <div className="text-3xl font-bold text-red-900">
                {adAnalytics.data?.ctr?.toFixed(2) ?? '0'}%
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500">
            <p>No advertisement data available</p>
          </Card>
        )}
      </div>
    </div>
  );
}
