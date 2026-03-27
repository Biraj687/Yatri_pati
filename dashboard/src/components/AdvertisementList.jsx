/**
 * AdvertisementList Component
 * Displays all advertisements with CRUD operations
 */

import React, { useState } from 'react';
import type { Advertisement, AsyncState, PaginatedResponse } from '@shared/types';
import { AdvertisementCard } from './AdvertisementCard';
import { AdvertisementForm } from './AdvertisementForm';



export const AdvertisementList: React.FC = ({
  advertisements,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  onToggleSuccess,
}) => {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, loading, error } = advertisements;

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-48 rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const adsList = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  if (adsList.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 font-medium">No Advertisements</p>
        <p className="text-sm text-gray-500 mt-1">No advertisements found. Create one to get started.</p>
        <button
          onClick={() => {
            setSelectedAd(null);
            setShowForm(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Advertisement
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisements</h2>
        <button
          onClick={() => {
            setSelectedAd(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + New Advertisement
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {selectedAd ? 'Edit Advertisement' : 'Create Advertisement'}
          </h3>
          <AdvertisementForm
            initialData={selectedAd || undefined}
            onSubmitSuccess={() => {
              setShowForm(false);
              if (selectedAd) {
                onUpdateSuccess?.();
              } else {
                onCreateSuccess?.();
              }
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Advertisements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adsList.map(ad => (
          <AdvertisementCard
            key={ad.id}
            advertisement={ad}
            onEdit={(updatedAd) => {
              setSelectedAd(updatedAd);
              setShowForm(true);
            }}
            onToggle={onToggleSuccess}
            onDelete={onDeleteSuccess}
          />
        ))}
      </div>

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

