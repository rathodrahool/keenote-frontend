import { BaseApiService } from './BaseApiService';
import { API_ENDPOINTS } from '../../config/api.config';
import { Task, CreateTaskDto, ApiResponse, FindAllQuery } from '../../types/task';

export class TaskService extends BaseApiService {
  private static instance: TaskService;

  private constructor() {
    super();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  private buildQueryString(query: FindAllQuery): string {
    const params = new URLSearchParams();
    
    if (query.search) {
      params.append('search', query.search);
    }
    
    if (query.page) {
      params.append('page', query.page.toString());
    }
    
    if (query.limit) {
      params.append('limit', query.limit.toString());
    }
    
    if (query.category) {
      params.append('category', query.category);
    }

    if (query.status) {
      params.append('status', query.status);
    }

    if (query.task_type) {
      params.append('task_type', query.task_type);
    }

    if (query.task_frequency) {
      params.append('task_frequency', query.task_frequency);
    }
    
    if (query.order) {
      Object.entries(query.order).forEach(([key, value]) => {
        params.append(`order[${key}]`, value.toString());
      });
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getTasks(query?: FindAllQuery): Promise<ApiResponse<Task[]>> {
    const queryString = this.buildQueryString(query || {});
    return this.get<ApiResponse<Task[]>>(`${API_ENDPOINTS.task}${queryString}`);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.get<ApiResponse<Task>>(`${API_ENDPOINTS.task}/${id}`);
  }

  async createTask(task: CreateTaskDto): Promise<ApiResponse<Task>> {
    return this.post<ApiResponse<Task>>(API_ENDPOINTS.task, task);
  }

  async updateTask(id: string, task: Partial<CreateTaskDto>): Promise<ApiResponse<Task>> {
    return this.patch<ApiResponse<Task>>(`${API_ENDPOINTS.task}/${id}`, task);
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${API_ENDPOINTS.task}/${id}`);
  }

  // Helper method to get tasks by category
  async getTasksByCategory(categoryId: string, query?: Omit<FindAllQuery, 'category'>): Promise<ApiResponse<Task[]>> {
    return this.getTasks({
      ...query,
      category: categoryId
    });
  }
} 