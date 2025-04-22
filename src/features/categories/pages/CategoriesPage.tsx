import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { CategoryList } from '../components/CategoryList';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { useCategories } from '../../../context/CategoryContext';

export const CategoriesPage = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { addCategory, updateCategory } = useCategories();

  const handleSubmit = (data: { name: string; color: string }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory({ ...data, isArchived: false });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your task categories</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {/* Toggle */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 border-b-2 ${
            !showArchived 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500'
          }`}
          onClick={() => setShowArchived(false)}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            showArchived 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500'
          }`}
          onClick={() => setShowArchived(true)}
        >
          Archived
        </button>
      </div>

      {/* Category List */}
      <CategoryList showArchived={showArchived} onEdit={handleEdit} />

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
};
