/**
 * AdvertisementManagementPage
 * Dashboard page for managing advertisements
 */

import React from 'react';
import { useAdvertisements } from '@shared/hooks';
import { AdvertisementList } from '../components/AdvertisementList';
import { AdvertisementAnalytics } from '../components/AdvertisementAnalytics';

export const AdvertisementManagementPage= () => {
  const advertisements = useAdvertisements({ page, limit: 12 });

  const handleRefresh = () => {
    advertisements.refetch();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
        <p className="text-gray-600 mt-2">
          Manage advertisements displayed across the portal and track their performance
        </p>
      </div>

      {/* Analytics Section */}
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Refresh
          </button>
        </div>
        <AdvertisementAnalytics />
      </div>

      {/* Advertisements List */}
      <div className="bg-white p-6 rounded-lg">
        <AdvertisementList
          advertisements={advertisements}
          onCreateSuccess={handleRefresh}
          onUpdateSuccess={handleRefresh}
          onDeleteSuccess={handleRefresh}
          onToggleSuccess={handleRefresh}
        />
      </div>
    </div>
  );
};

export default AdvertisementManagementPage;

