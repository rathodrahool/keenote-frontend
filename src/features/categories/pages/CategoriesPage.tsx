import React, { useState } from 'react';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/common/Button';
import { CategoryCard } from '../components/CategoryCard';
import { CategoryModal } from '../components/CategoryModal';
import { useCategories } from '../../../context/CategoryContext';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { useSearchParams } from 'react-router-dom';

export const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('view') === 'archived' ? 'archived' : 'active';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string; name: string} | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<{id: string; name: string; color: string} | null>(null);
  const { categories, addCategory, updateCategory, deleteCategory, archiveCategory } = useCategories();

  const filteredCategories = categories.filter(cat => 
    activeTab === 'archived' ? cat.isArchived : !cat.isArchived
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your task categories</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setSearchParams({})}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors relative
              ${activeTab === 'active' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Active
          </button>
          <button
            onClick={() => setSearchParams({ view: 'archived' })}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors relative
              ${activeTab === 'archived'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <FolderIcon className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {activeTab === 'archived' 
                ? 'No archived categories' 
                : 'No categories yet'
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              {activeTab === 'archived'
                ? 'Archived categories will appear here'
                : 'Create your first category to start organizing your tasks'
              }
            </p>
            {activeTab === 'active' && (
              <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                <PlusIcon className="w-5 h-5 mr-1.5" />
                Add Category
              </Button>
            )}
          </div>
        ) : (
          filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              {...category}
              onEdit={() => setCategoryToEdit({
                id: category.id,
                name: category.name,
                color: category.color
              })}
              onArchive={() => archiveCategory(category.id)}
              onDelete={() => setCategoryToDelete({ id: category.id, name: category.name })}
            />
          ))
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen || !!categoryToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSubmit={(data) => {
          if (categoryToEdit) {
            updateCategory(categoryToEdit.id, data);
            setCategoryToEdit(null);
          } else {
            addCategory({ ...data, isArchived: false });
            setIsModalOpen(false);
          }
        }}
        initialData={categoryToEdit || undefined}
      />

      <DeleteConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }
        }}
        categoryName={categoryToDelete?.name || ''}
      />
    </div>
  );
};
