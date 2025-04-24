import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Task, TaskContextType, CreateTaskDto, FindAllQuery } from '../types/task';
import { useTaskService } from '../hooks/useTaskService';
import { ApiError } from '../services/api/BaseApiService';
import { useToast } from './ToastContext';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TaskContextType['pagination']>(null);

  const { addToast } = useToast();
  const {
    getTasks,
    createTask: apiCreateTask,
    updateTask: apiUpdateTask,
    deleteTask: apiDeleteTask,
  } = useTaskService();

  const fetchTasks = useCallback(async (query?: FindAllQuery) => {
    try {
      setIsLoading(true);
      const response = await getTasks(query);
      setTasks(response.data || []);
      setPagination(response.meta || null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      setTasks([]); // Reset tasks on error
    } finally {
      setIsLoading(false);
    }
  }, [getTasks, addToast]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchTasks]);

  const addTask = async (taskData: CreateTaskDto) => {
    try {
      const response = await apiCreateTask(taskData);
      setTasks(prev => [...prev, response.data]);
      setError(null);
      addToast({
        type: 'success',
        message: 'Task added successfully!'
      });
      // Refresh the list to ensure consistency
      fetchTasks();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create task';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const updateTask = async (id: string, updatedData: Partial<CreateTaskDto>) => {
    try {
      const response = await apiUpdateTask(id, updatedData);
      setTasks(prev =>
        prev.map(task =>
          task._id === id ? response.data : task
        )
      );
      setError(null);
      addToast({
        type: 'success',
        message: 'Task updated successfully!'
      });
      // Refresh the list to ensure consistency
      fetchTasks();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update task';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      setError(null);
      addToast({
        type: 'success',
        message: 'Task deleted successfully!'
      });
      // Refresh the list to ensure consistency
      fetchTasks();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete task';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.category === categoryId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByCategory,
        isLoading,
        error,
        pagination,
        setPagination,
        refreshTasks: () => fetchTasks(),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
