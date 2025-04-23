import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { TaskList } from '../components/TaskList';
import { TaskFormModal } from '../components/TaskFormModal';
import { useTasks } from '../../../context/TaskContext';
import { useCategories } from '../../../context/CategoryContext';
import { Task } from '../../../types/task';

export const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addTask, updateTask } = useTasks();
  const { categories } = useCategories();

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your daily tasks and activities</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Task
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 border-b-2 ${
            selectedCategory === 'all'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All Tasks
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 border-b-2 ${
              selectedCategory === category.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Task List */}
      <TaskList 
        categoryId={selectedCategory === 'all' ? undefined : selectedCategory} 
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
      />
    </div>
  );
};
