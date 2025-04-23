import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/25" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter task title"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
