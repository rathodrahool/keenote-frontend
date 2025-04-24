import { Category } from './category';

export enum TaskType {
  TIME_BASED = 'TIME_BASED',
  YES_NO = 'YES_NO',
}

export enum TaskFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface CreateTaskDto {
  name: string;
  task_type: TaskType;
  task_frequency: TaskFrequency;
  duration?: number;
  target?: number;
  start_date: string; // format: dd-MM-yyyy
  end_date: string; // format: dd-MM-yyyy
  category: string; // MongoDB ID
  status?: Status;
}

export interface Task {
  _id: string;
  name: string;
  task_type: TaskType;
  task_frequency: TaskFrequency;
  duration: number;
  target: number;
  start_date: string;
  end_date: string;
  category: Category;
  status: Status;
  deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface FindAllQuery {
  search?: string;
  order?: { [key: string]: 'asc' | 'desc' | 1 | -1 };
  page?: number;
  limit?: number;
  category?: string;
  status?: Status;
  task_type?: TaskType;
  task_frequency?: TaskFrequency;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, task: Partial<CreateTaskDto>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByCategory: (categoryId: string) => Task[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  setPagination: (pagination: TaskContextType['pagination']) => void;
  refreshTasks: () => Promise<void>;
}
