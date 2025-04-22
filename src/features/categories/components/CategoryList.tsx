import React from 'react';
import { useCategories } from '../../../context/CategoryContext';
import { CategoryCard } from './CategoryCard';
import { Category } from '../../../types/category';

interface CategoryListProps {
  showArchived?: boolean;
}

export const CategoryList = ({ showArchived = false }: CategoryListProps) => {
  const { categories, updateCategory, archiveCategory, deleteCategory } = useCategories();

  const filteredCategories = categories.filter(
    category => category.isArchived === showArchived
  );

  const handleEdit = (category: Category) => {
    // Will implement edit modal/form later
    console.log('Edit category:', category);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCategories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={handleEdit}
          onArchive={archiveCategory}
          onDelete={deleteCategory}
        />
      ))}
      {filteredCategories.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No categories {showArchived ? 'archived' : 'available'}
        </div>
      )}
    </div>
  );
};
