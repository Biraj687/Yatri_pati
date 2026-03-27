/**
 * AdvertisementAnalytics Component
 * Display advertisement performance metrics
 */

import React from 'react';
import { useAdvertisementAnalytics } from '@shared/hooks';

export const AdvertisementAnalytics= () => {
  const analyticsState = useAdvertisementAnalytics();

  if (analyticsState.loading && !analyticsState.data) {
    return (
      <div className="animate-pulse bg-gray-200 h-64 rounded" />
    );
  }

  if (analyticsState.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{analyticsState.error}</p>
      </div>
    );
  }

  const data = analyticsState.data  | null;

  if (!data) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
        No analytics data available
      </div>
    );
  }

  const totalImpressions = data.totalImpressions ?? 0;
  const totalClicks = data.totalClicks ?? 0;
  const ctr = ((totalClicks / totalImpressions) * 100 || 0).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm font-medium">Total Impressions</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm font-medium">Click-Through Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{ctr}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm font-medium">Active Ads</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{(data.topAds?.length ?? 0)}</p>
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Top Performing Advertisements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Impressions</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Clicks</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.topAds?.map(ad => {
                const adImpressions = ad?.impressions ?? 0;
                const adClicks = ad?.clicks ?? 0;
                const adCtr = ((adClicks / adImpressions) * 100 || 0).toFixed(2);
                return (
                  <tr key={ad?.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{ad?.title}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{adImpressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{adClicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{adCtr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

