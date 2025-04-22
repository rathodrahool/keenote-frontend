import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Category } from '../../../types/category';
import { useToast } from '../../../context/ToastContext';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
  editCategory?: Category;
}

export const CategoryFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editCategory 
}: CategoryFormModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10B981');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setColor(editCategory.color);
    }
  }, [editCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Category name must be at least 3 characters');
      return;
    }
    
    try {
      onSubmit({ name: name.trim(), color });
      showToast(
        `Category ${editCategory ? 'updated' : 'created'} successfully!`,
        'success'
      );
      handleClose();
    } catch (err) {
      showToast('Failed to save category', 'error');
    }
  };

  const handleClose = () => {
    setName('');
    setColor('#10B981');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editCategory ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 p-1 rounded-md cursor-pointer"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
