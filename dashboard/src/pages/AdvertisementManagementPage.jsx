/**
 * AdvertisementManagementPage
 * Dashboard page for managing advertisements
 */

import React, { useState } from 'react';
import { useAdvertisements } from '@shared/hooks';
import { AdvertisementList } from '../components/AdvertisementList';
import { AdvertisementAnalytics } from '../components/AdvertisementAnalytics';
import { Button } from '../components/UI';
import { FiPlus } from 'react-icons/fi';
import { Modal } from '../components/UI';
import { AdvertisementForm } from '../components/AdvertisementForm';

export const AdvertisementManagementPage = () => {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const advertisements = useAdvertisements({ page, limit: 12 });

  const handleRefresh = () => {
    advertisements.refetch?.();
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    handleRefresh();
  };

  const handleOpenModal = () => {
    console.log('Opening modal...');
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal...');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-gray-600 text-sm mt-2">
            Manage advertisements displayed across the portal and track their performance
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenModal}
          className="gap-2 w-full sm:w-auto"
        >
          <FiPlus size={20} />
          New Advertisement
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
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
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <AdvertisementList
          advertisements={advertisements}
          onCreateSuccess={handleCreateSuccess}
          onUpdateSuccess={handleRefresh}
          onDeleteSuccess={handleRefresh}
          onToggleSuccess={handleRefresh}
        />
      </div>

      {/* Create Advertisement Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          title="Create New Advertisement"
          onClose={handleCloseModal}
          size="xl"
        >
          <AdvertisementForm
            onSubmitSuccess={handleCreateSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdvertisementManagementPage;

