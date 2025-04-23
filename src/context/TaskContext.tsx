import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskContextType, TimeEntry } from '../types/task';
import { useToast } from './ToastContext';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((task: any) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: task.endDate ? new Date(task.endDate) : undefined,
        currentTimer: task.currentTimer ? {
          ...task.currentTimer,
          startTime: new Date(task.currentTimer.startTime)
        } : undefined,
        timeEntries: (task.timeEntries || []).map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined
        }))
      }));
    }
    return [];
  });

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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
      prev.map(task => {
        if (task.id !== id) return task;

        if (task.type === 'yes-no') {
          const today = new Date().toDateString();
          const completionsToday = task.completionsToday || 0;
          
          // Don't allow more completions than max
          if (completionsToday >= (task.maxCompletions || 1)) {
            return task;
          }

          return {
            ...task,
            completionsToday: completionsToday + 1,
            status: completionsToday + 1 >= (task.maxCompletions || 1) ? 'completed' : 'in-progress',
            updatedAt: new Date()
          };
        }

        // Handle time-based tasks as before
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed',
          updatedAt: new Date()
        };
      })
    );
  };

  // Reset completions at midnight
  useEffect(() => {
    const resetCompletions = () => {
      setTasks(prev =>
        prev.map(task => 
          task.type === 'yes-no' 
            ? { ...task, completionsToday: 0, status: 'pending' }
            : task
        )
      );
    };

    // Check if we need to reset on initial load
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timer = setTimeout(resetCompletions, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const startTimer = (taskId: string) => {
    // Stop any running timers first
    const runningTask = tasks.find(t => t.currentTimer?.isRunning);
    if (runningTask) {
      stopTimer(runningTask.id);
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              currentTimer: {
                startTime: new Date(),
                isRunning: true,
              },
              status: 'in-progress',
            }
          : task
      )
    );
  };

  const stopTimer = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId || !task.currentTimer?.isRunning) return task;

        const endTime = new Date();
        const duration = Math.floor(
          (endTime.getTime() - task.currentTimer.startTime.getTime()) / 60000
        );

        const newTimeEntry: TimeEntry = {
          id: uuidv4(),
          startTime: task.currentTimer.startTime,
          endTime,
          duration,
          isManual: false,
        };

        return {
          ...task,
          currentTimer: undefined,
          timeEntries: [...(task.timeEntries || []), newTimeEntry],
          status: duration >= (task.targetDuration || 0) ? 'completed' : 'in-progress',
        };
      })
    );
  };

  const deleteTimeEntry = (taskId: string, entryId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              timeEntries: task.timeEntries?.filter(entry => entry.id !== entryId)
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
    startTimer,
    stopTimer,
    deleteTimeEntry,
    getTaskTimeEntries: (taskId: string) => 
      tasks.find(t => t.id === taskId)?.timeEntries || [],
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
