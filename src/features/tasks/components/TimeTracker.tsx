import React, { useState, useEffect } from 'react';
import { PlayIcon, StopIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Task, TimeEntry } from '../../../types/task';

interface TimeTrackerProps {
  task: Task;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
}

export const TimeTracker = ({ task, onStartTimer, onStopTimer }: TimeTrackerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Calculate total time from all entries
  const getTotalTrackedTime = (entries: TimeEntry[] = []) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (task.currentTimer?.isRunning) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - task.currentTimer!.startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.currentTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <ClockIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-600">
          Total: {getTotalTrackedTime(task.timeEntries)} min
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {task.currentTimer?.isRunning && (
          <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
        )}
        {task.currentTimer?.isRunning ? (
          <button
            onClick={() => onStopTimer(task.id)}
            className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
          >
            <StopIcon className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onStartTimer(task.id)}
            className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600"
          >
            <PlayIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
