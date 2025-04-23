import React from 'react';
import { Task } from '../../../types/task';
import { Card } from '../../../components/common/Card';
import { useCategories } from '../../../context/CategoryContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) => {
  const { categories } = useCategories();
  const category = categories.find(c => c.categoryId === task.categoryId);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category?.color }}
            />
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>{task.frequency}</span>
            {task.type === 'time-based' && task.targetDuration && (
              <span>• {task.targetDuration} min</span>
            )}
            {task.type === 'yes-no' && task.maxCompletions && (
              <span>• Max {task.maxCompletions}x</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleStatus(task.id)}
              className="p-2 text-gray-500 hover:text-emerald-600 rounded-full"
            >
              {task.status === 'completed' ? 'Undo' : 'Complete'}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 hover:text-emerald-600 rounded-full"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
