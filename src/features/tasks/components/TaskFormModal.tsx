import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Task, TaskType, TaskFrequency } from '../../../types/task';
import { useCategories } from '../../../context/CategoryContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task;
}

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask
}: TaskFormModalProps) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    type: 'time-based' as TaskType,
    frequency: 'daily' as TaskFrequency,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetDuration: 0,
    maxCompletions: 1,
    isActive: true,
    status: 'pending' as const
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        ...editingTask,
        startDate: new Date(editingTask.startDate).toISOString().split('T')[0],
        endDate: editingTask.endDate ? new Date(editingTask.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [editingTask]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="time-based">Time-based</option>
                <option value="yes-no">Yes/No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as TaskFrequency })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="once">Once</option>
              </select>
            </div>
          </div>

          {formData.type === 'time-based' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.targetDuration}
                onChange={(e) => setFormData({ ...formData, targetDuration: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
              />
            </div>
          )}

          {formData.type === 'yes-no' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Completions Per Day
              </label>
              <input
                type="number"
                value={formData.maxCompletions}
                onChange={(e) => setFormData({ ...formData, maxCompletions: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
