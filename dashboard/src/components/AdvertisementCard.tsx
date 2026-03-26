/**
 * AdvertisementCard Component
 * Individual advertisement card for dashboard display
 */

import React, { useState } from 'react';
import type { Advertisement } from '@shared/types';
import { advertisementService } from '@shared/services';

interface AdvertisementCardProps {
  advertisement: Advertisement;
  onEdit: (ad: Advertisement) => void;
  onToggle?: () => void;
  onDelete?: () => void;
}

export const AdvertisementCard: React.FC<AdvertisementCardProps> = ({
  advertisement,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    setIsDeleting(true);
    try {
      const response = await advertisementService.deleteAdvertisement(advertisement.id);
      if (response.success) {
        onDelete?.();
      } else {
        alert(`Failed to delete: ${response.error}`);
      }
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const response = await advertisementService.toggleAdvertisement(advertisement.id);
      if (response.success) {
        onToggle?.();
      } else {
        alert(`Failed to toggle: ${response.error}`);
      }
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={advertisement.imageUrl}
          alt={advertisement.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{advertisement.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{advertisement.position}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
              advertisement.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {advertisement.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Description */}
        {advertisement.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{advertisement.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y text-xs">
          <div>
            <p className="text-gray-500">Impressions</p>
            <p className="font-semibold">{advertisement.impressions || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Clicks</p>
            <p className="font-semibold">{advertisement.clicks || 0}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(advertisement)}
            className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
          >
            Edit
          </button>
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex-1 px-3 py-1 text-sm rounded transition ${
              isToggling
                ? 'opacity-50 cursor-not-allowed'
                : advertisement.isActive
                  ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {isToggling ? '...' : advertisement.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        </div>

        {/* Link Preview */}
        {advertisement.linkUrl && (
          <div className="pt-2 border-t">
            <a
              href={advertisement.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline truncate block"
            >
              {advertisement.linkUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
