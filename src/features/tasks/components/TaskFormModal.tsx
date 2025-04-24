import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/common/Button';
import { CreateTaskDto, TaskType, TaskFrequency, Status, Task } from '../../../types/task';
import { useCategories } from '../../../context/CategoryContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto, taskId?: string) => void;
  initialData?: Task;
}

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: TaskFormModalProps) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<CreateTaskDto>({
    name: '',
    task_type: TaskType.TIME_BASED,
    task_frequency: TaskFrequency.DAILY,
    duration: 0,
    target: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    category: '',
    status: Status.ACTIVE
  });

  // Helper function to convert dd-MM-yyyy to YYYY-MM-DD
  const convertDateFormat = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        name: initialData.name,
        task_type: initialData.task_type,
        task_frequency: initialData.task_frequency,
        duration: initialData.duration || 0,
        target: initialData.target || 1,
        start_date: convertDateFormat(initialData.start_date),
        end_date: convertDateFormat(initialData.end_date),
        category: initialData.category,
        status: initialData.status
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      start_date: new Date(formData.start_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-'),
      end_date: formData.end_date ? new Date(formData.end_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-') : ''
    };
    onSubmit(submitData, initialData?._id);
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
                {initialData ? 'Edit Task' : 'New Task'}
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter task name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
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
                      value={formData.task_type}
                      onChange={(e) => setFormData({ ...formData, task_type: e.target.value as TaskType })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={TaskType.TIME_BASED}>Time-based</option>
                      <option value={TaskType.YES_NO}>Yes/No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={formData.task_frequency}
                      onChange={(e) => setFormData({ ...formData, task_frequency: e.target.value as TaskFrequency })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={TaskFrequency.DAILY}>Daily</option>
                      <option value={TaskFrequency.WEEKLY}>Weekly</option>
                      <option value={TaskFrequency.MONTHLY}>Monthly</option>
                    </select>
                  </div>
                </div>

                {formData.task_type === TaskType.TIME_BASED && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      min="1"
                    />
                  </div>
                )}

                {formData.task_type === TaskType.YES_NO && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Completions
                    </label>
                    <input
                      type="number"
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
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
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                    {initialData ? 'Save Changes' : 'Create Task'}
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
