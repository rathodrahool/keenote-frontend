import React from 'react';
import { TimeEntry } from '../../../types/task';
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimeHistoryProps {
  timeEntries: TimeEntry[];
  onDeleteEntry: (entryId: string) => void;
}

export const TimeHistory = ({ timeEntries, onDeleteEntry }: TimeHistoryProps) => {
  const groupedEntries = timeEntries.reduce((acc, entry) => {
    const date = entry.startTime.toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  const getTotalDuration = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedEntries).map(([date, entries]) => (
        <div key={date} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">{date}</h3>
            <span className="text-sm text-gray-500">
              Total: {getTotalDuration(entries)} minutes
            </span>
          </div>
          <div className="space-y-2">
            {entries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span>{entry.startTime.toLocaleTimeString()}</span>
                  <span>-</span>
                  <span>{entry.endTime?.toLocaleTimeString()}</span>
                  <span className="text-gray-500">({entry.duration} min)</span>
                </div>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
