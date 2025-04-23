import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { TaskTable } from '../components/TaskTable';
import { TaskFormModal } from '../components/TaskFormModal';
import { useTasks } from '../../../context/TaskContext';
import { Task } from '../../../types/task';

export const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    handleCloseModal();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
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

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={deleteTask}
        onToggleStatus={toggleTaskStatus}
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
