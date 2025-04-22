import React from 'react';
import { Category } from '../../../types/category';
import { Card } from '../../../components/common/Card';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard = ({ category, onEdit, onArchive, onDelete }: CategoryCardProps) => {
  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <h3 className="font-semibold text-gray-800">{category.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-500 hover:text-emerald-600 rounded-full"
          >
            Edit
          </button>
          <button
            onClick={() => onArchive(category.id)}
            className="p-2 text-gray-500 hover:text-emerald-600 rounded-full"
          >
            {category.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-full"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
};
