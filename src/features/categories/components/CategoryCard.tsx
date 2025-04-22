import React from 'react';
import { PencilIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryCardProps {
  name: string;
  color: string;
  tasksCount: number;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isArchived?: boolean;
}

export const CategoryCard = ({ name, color, tasksCount, onEdit, onArchive, onDelete, isArchived = false }: CategoryCardProps) => {
  return (
    <div className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{tasksCount} tasks</span>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButton icon={<PencilIcon className="w-5 h-5" />} onClick={onEdit} tooltip="Edit category" />
            <ActionButton icon={<ArchiveBoxIcon className="w-5 h-5" />} onClick={onArchive} tooltip={isArchived ? "Unarchive category" : "Archive category"} />
            <ActionButton icon={<TrashIcon className="w-5 h-5" />} onClick={onDelete} tooltip="Delete category" danger />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip: string;
  danger?: boolean;
}

const ActionButton = ({ icon, onClick, tooltip, danger }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={`
      p-2 rounded-md relative group/tooltip
      ${danger 
        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    {icon}
    <span className="
      absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
      bg-gray-900 text-white text-xs rounded
      opacity-0 group-hover/tooltip:opacity-100 
      pointer-events-none transition-opacity whitespace-nowrap
    ">
      {tooltip}
    </span>
  </button>
);
