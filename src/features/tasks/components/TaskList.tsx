import React, { useState, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../../context/TaskContext';
import { TaskStatus } from '../../../types/task';

interface TaskListProps {
  categoryId?: string;
}

export const TaskList = ({ categoryId }: TaskListProps) => {
  const { tasks, deleteTask, toggleTaskStatus } = useTasks();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, categoryId, statusFilter]);

  const handleEdit = (task: Task) => {
    // Will be implemented when we add routing
    console.log('Edit task:', task);
  };

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex space-x-4 border-b border-gray-200">
        {['all', 'pending', 'in-progress', 'completed', 'missed'].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 border-b-2 ${
              statusFilter === status
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setStatusFilter(status as TaskStatus | 'all')}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={deleteTask}
            onToggleStatus={toggleTaskStatus}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};
