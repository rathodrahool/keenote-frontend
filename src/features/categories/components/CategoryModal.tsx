import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/common/Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
  initialData?: { name: string; color: string };
}

export const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }: CategoryModalProps) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [color, setColor] = useState(initialData?.color ?? '#10B981');

  // Reset form when initialData changes
  useEffect(() => {
    setName(initialData?.name ?? '');
    setColor(initialData?.color ?? '#10B981');
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/25" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {initialData ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onSubmit({ name, color });
              onClose();
            }}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">{color}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {initialData ? 'Save Changes' : 'Create Category'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
