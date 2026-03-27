/**
 * CategoryList Component
 * Displays categories in a sortable table with drag-and-drop reordering
 */

import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiMove } from 'react-icons/fi';
import { Button } from './UI';

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [localCategories, setLocalCategories] = useState(categories);

  React.useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (index) => {
    setDragOverItem(index);
  };

  const handleDragEnd = () => {
    if (draggedItem === null || dragOverItem === null) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    if (draggedItem === dragOverItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newCategories = [...localCategories];
    const draggedCategory = newCategories[draggedItem];
    newCategories.splice(draggedItem, 1);
    newCategories.splice(dragOverItem, 0, draggedCategory);

    setLocalCategories(newCategories);
    const orderedIds = newCategories.map(c => c.id);
    onReorder?.(orderedIds);

    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Order</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Slug</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Created</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {localCategories.map((category, index) => (
            <tr
              key={category.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              className={`transition-colors ${
                draggedItem === index ? 'opacity-50 bg-gray-100' : 'hover:bg-gray-50'
              } ${dragOverItem === index ? 'border-t-2 border-blue-500' : ''}`}
            >
              <td className="px-6 py-4 text-gray-900">
                <div className="flex items-center gap-2 cursor-move group">
                  <FiMove size={18} className="text-gray-400 group-hover:text-gray-600" />
                  <span className="font-medium">{category.order}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
              <td className="px-6 py-4 text-gray-600">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{category.slug}</code>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus?.(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 text-gray-600 text-xs">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit?.(category)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete?.(category.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
