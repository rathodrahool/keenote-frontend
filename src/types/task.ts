export type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'once';
export type TaskType = 'time-based' | 'yes-no';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'missed';

export interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  isManual: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  type: TaskType;
  frequency: TaskFrequency;
  startDate: Date;
  endDate?: Date;
  targetDuration?: number; // in minutes, for time-based tasks
  maxCompletions?: number; // for yes-no tasks
  isActive: boolean;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  timeEntries?: TimeEntry[];
  currentTimer?: {
    startTime: Date;
    isRunning: boolean;
  };
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  toggleTaskStatus: (id: string) => void;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  getTaskTimeEntries: (taskId: string) => TimeEntry[];
}
