import React, { createContext, useContext, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskContextType } from '../types/task';
import { useToast } from './ToastContext';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Daily Workout',
      description: 'Morning exercise routine',
      categoryId: '1', // Work category
      type: 'time-based',
      frequency: 'daily',
      startDate: new Date(),
      targetDuration: 30,
      isActive: true,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Read a Book',
      description: 'Read at least one chapter',
      categoryId: '2', // Personal category
      type: 'time-based',
      frequency: 'daily',
      startDate: new Date(),
      targetDuration: 45,
      isActive: true,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Grocery Shopping',
      description: 'Buy weekly groceries',
      categoryId: '3', // Shopping category
      type: 'yes-no',
      frequency: 'weekly',
      startDate: new Date(),
      maxCompletions: 1,
      isActive: true,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const { showToast } = useToast();

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    showToast('Task created successfully!', 'success');
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updatedData, updatedAt: new Date() }
          : task
      )
    );
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    showToast('Task deleted successfully!', 'success');
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
    toggleTaskStatus,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
