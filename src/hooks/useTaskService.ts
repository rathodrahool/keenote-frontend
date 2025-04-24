import { useCallback } from 'react';
import { TaskService } from '../services/api/TaskService';
import { Task, CreateTaskDto, ApiResponse, FindAllQuery } from '../types/task';

export const useTaskService = () => {
  const taskService = TaskService.getInstance();

  const getTasks = useCallback(async (query?: FindAllQuery): Promise<ApiResponse<Task[]>> => {
    return taskService.getTasks(query);
  }, []);

  const getTask = useCallback(async (id: string): Promise<ApiResponse<Task>> => {
    return taskService.getTask(id);
  }, []);

  const createTask = useCallback(async (
    task: CreateTaskDto
  ): Promise<ApiResponse<Task>> => {
    return taskService.createTask(task);
  }, []);

  const updateTask = useCallback(async (
    id: string,
    task: Partial<CreateTaskDto>
  ): Promise<ApiResponse<Task>> => {
    return taskService.updateTask(id, task);
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    return taskService.deleteTask(id);
  }, []);

  const getTasksByCategory = useCallback(async (
    categoryId: string,
    query?: Omit<FindAllQuery, 'category'>
  ): Promise<ApiResponse<Task[]>> => {
    return taskService.getTasksByCategory(categoryId, query);
  }, []);

  return {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
  };
}; 