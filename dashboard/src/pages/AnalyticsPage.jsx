/**
 * Analytics Page - Dashboard metrics and analytics
 */

import { useEffect, useState } from 'react';
import { useDashboard } from '@context/DashboardContext';
import { useNotification } from '@context/NotificationContext';



export function AnalyticsPage() {
  const { stats, loadStats, loading } = useDashboard();
  const { showNotification } = useNotification();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

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
      } catch (error) {
        showNotification((error ).message, 'error');
      }
    };

    fetchData();
  }, [loadStats, showNotification]);

  if (loading) {
    return <LoadingSkeletons />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your dashboard performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Articles"
          value={stats?.totalArticles ?? 0}
          change="+12%"
          color="blue"
        />
        <MetricCard
          title="Published"
          value={stats?.publishedArticles ?? 0}
          change="+8%"
          color="green"
        />
        <MetricCard
          title="Total Views"
          value={stats?.totalViews ?? 0}
          change="+23%"
          color="purple"
        />
        <MetricCard
          title="Active Authors"
          value={stats?.totalAuthors ?? 0}
          change="+2%"
          color="orange"
        />
      </div>

      {/* Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Views Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Article Views (7 days)</h2>
            <BarChart data={analytics.articleViews} dates={analytics.dates} />
          </div>

          {/* Ad Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Impressions (7 days)</h2>
            <BarChart data={analytics.adImpressions} dates={analytics.dates} color="orange" />
          </div>

          {/* CTR Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Article Click Rate</h2>
            <LineChart data={analytics.articleClicks} />
          </div>

          {/* Ad Click Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Click Performance</h2>
            <LineChart data={analytics.adClicks} color="green" />
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.recentArticles.slice(0, 5).map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{article.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.views ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function MetricCard({
  title,
  value,
  change,
  color,
}: {
  title: string;
  value: number;
  change: string;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className={`${colors[color  typeof colors]} rounded-lg p-6`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
      <p className="text-xs font-semibold mt-2">{change} vs last month</p>
    </div>
  );
}

function BarChart({
  data,
  dates,
  color = 'blue',
}: {
  data: number[];
  dates: string[];
  color?: string;
}) {
  const max = Math.max(...data);

  const colorClass = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
  }[color];

  return (
    <div className="flex items-end justify-between gap-2 h-64">
      {data.map((value, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col-reverse">
            <div
              className={`w-full ${colorClass} rounded-t`}
              style={{ height: `${(value / max) * 200}px` }}
              title={`${value}`}
            />
          </div>
          <span className="text-xs text-gray-500">{dates[idx].split('-')[2]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  data,
  color = 'purple',
}: {
  data: number[];
  color?: string;
}) {
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

  return (
    <div className="h-64">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#f3f4f6"
            strokeWidth="0.5"
          />
        ))}
        {/* Line */}
        <path d={pathD} fill="none" className={colorClass} strokeWidth="1.5" />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#6366f1" />
        ))}
      </svg>
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function generateLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

