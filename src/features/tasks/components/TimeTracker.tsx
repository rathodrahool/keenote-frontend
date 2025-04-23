import React, { useState, useEffect } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import { Task } from '../../../types/task';

interface TimeTrackerProps {
  task: Task;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
}

export const TimeTracker = ({ task, onStartTimer, onStopTimer }: TimeTrackerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

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
    <div className="flex items-center space-x-2">
      <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
      {task.currentTimer?.isRunning ? (
        <button
          onClick={() => onStopTimer(task.id)}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
        >
          <StopIcon className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={() => onStartTimer(task.id)}
          className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600"
        >
          <PlayIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
