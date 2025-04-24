import React, { useState } from 'react';
import { PlusIcon, FolderIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    archiveCategory,
    unarchiveCategory 
  } = useCategories();

  const filteredCategories = categories.filter(cat => {
    const matchesTab = activeTab === 'archived' ? cat.is_archived : !cat.is_archived;
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleArchiveToggle = (id: string, isArchived: boolean) => {
    if (isArchived) {
      unarchiveCategory(id);
    } else {
      archiveCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your task categories</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories"
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-1.5" />
            Add Category
          </Button>
        </div>
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
              {searchTerm 
                ? 'No matching categories found'
                : activeTab === 'archived' 
                  ? 'No archived categories' 
                  : 'No categories yet'
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              {searchTerm 
                ? `No categories matching "${searchTerm}"`
                : activeTab === 'archived'
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
              key={category._id}
              _id={category._id}
              name={category.name}
              color={category.color}
              tasksCount={0} // TODO: Add task count
              onEdit={(id) => setCategoryToEdit({
                id,
                name: category.name,
                color: category.color
              })}
              onArchive={() => handleArchiveToggle(category._id, category.is_archived)}
              onDelete={(id) => setCategoryToDelete({ id, name: category.name })}
              isArchived={category.is_archived}
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
            addCategory({ ...data, is_archived: false });
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
