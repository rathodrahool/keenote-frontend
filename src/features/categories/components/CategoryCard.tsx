import React from 'react';
import { PencilIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryCardProps {
  name: string;
  color: string;
  tasksCount: number;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export const CategoryCard = ({ name, color, tasksCount, onEdit, onArchive, onDelete }: CategoryCardProps) => {
  return (
    <div className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{tasksCount} tasks</span>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButton onClick={onEdit} icon={<PencilIcon className="w-4 h-4" />} />
            <ActionButton onClick={onArchive} icon={<ArchiveBoxIcon className="w-4 h-4" />} />
            <ActionButton onClick={onDelete} icon={<TrashIcon className="w-4 h-4" />} danger />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ 
  icon, 
  onClick, 
  danger = false 
}: { 
  icon: React.ReactNode; 
  onClick: () => void; 
  danger?: boolean; 
}) => (
  <button
    onClick={onClick}
    className={`p-1 ${danger ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
  </button>
);
