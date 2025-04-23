import React, { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Task } from '../../../types/task';
import { useCategories } from '../../../context/CategoryContext';
import { TimeTracker } from './TimeTracker';
import { useTasks } from '../../../context/TaskContext';
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleCompletion?: (taskId: string) => void;  // Add this prop
}

type SortField = 'title' | 'category' | 'type' | 'frequency' | 'status' | 'startDate';
type SortOrder = 'asc' | 'desc';

export const TaskTable = ({ tasks, onEdit, onDelete, onToggleCompletion }: TaskTableProps) => {
  const { categories } = useCategories();
  const { startTimer, stopTimer } = useTasks();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting and filtering
  const sortedAndFilteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === task.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let compareA, compareB;
      
      switch (sortField) {
        case 'category':
          compareA = categories.find(c => c.id === a.categoryId)?.name || '';
          compareB = categories.find(c => c.id === b.categoryId)?.name || '';
          break;
        case 'startDate':
          return sortOrder === 'asc' 
            ? a.startDate.getTime() - b.startDate.getTime()
            : b.startDate.getTime() - a.startDate.getTime();
        default:
          compareA = a[sortField];
          compareB = b[sortField];
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredTasks.length / itemsPerPage);
  const paginatedTasks = sortedAndFilteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyBadge = (frequency: Task['frequency']) => {
    const colors = {
      daily: 'bg-blue-50 text-blue-700',
      weekly: 'bg-purple-50 text-purple-700',
      monthly: 'bg-orange-50 text-orange-700',
      once: 'bg-gray-50 text-gray-700'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[frequency]}`}>
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-64
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <div className="text-sm text-gray-500">
          Showing {paginatedTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'title', label: 'Title' },
                { key: 'category', label: 'Category' },
                { key: 'type', label: 'Type' },
                { key: 'frequency', label: 'Frequency' },
                { key: 'timeTracked', label: 'Time Tracked' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => key !== 'actions' && handleSort(key as SortField)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {key !== 'actions' && sortField === key && (
                      sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500">{task.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: categories.find(c => c.id === task.categoryId)?.color }}
                    />
                    <span>{categories.find(c => c.id === task.categoryId)?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-900">
                      {task.type === 'time-based' 
                        ? `${task.targetDuration} min goal`
                        : `${task.maxCompletions}x per day`
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.type === 'time-based' ? 'Time-based' : 'Completion-based'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.type === 'time-based' ? (
                    <TimeTracker
                      task={task}
                      onStartTimer={startTimer}
                      onStopTimer={stopTimer}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {task.completionsToday || 0}/{task.maxCompletions} today
                      </span>
                      {onToggleCompletion && (
                        <button
                          onClick={() => onToggleCompletion(task.id)}
                          disabled={task.completionsToday >= (task.maxCompletions || 1)}
                          className={`p-2 rounded-full ${
                            task.completionsToday >= (task.maxCompletions || 1)
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
                          }`}
                        >
                          <SolidCheckCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getFrequencyBadge(task.frequency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit task"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      title="Delete task"
                    >
                      <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded px-3 py-2 text-sm font-medium text-gray-700 
              bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="ml-1">Previous</span>
          </button>
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded px-3 py-2 text-sm font-medium text-gray-700 
              bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-1">Next</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedAndFilteredTasks.length)}
              </span>{' '}
              of <span className="font-medium">{sortedAndFilteredTasks.length}</span> results
            </p>
          </div>
          
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset 
                ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">First</span>
              <ChevronLeftIcon className="h-5 w-5" />
              <ChevronLeftIcon className="h-5 w-5 -ml-2" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance === 0 || distance === 1 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <span key={`ellipsis-${page}`} className="relative inline-flex items-center px-4 py-2 
                      text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                      ${currentPage === page
                        ? 'z-10 bg-emerald-600 text-white focus-visible:outline-emerald-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset 
                ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Last</span>
              <ChevronRightIcon className="h-5 w-5" />
              <ChevronRightIcon className="h-5 w-5 -ml-2" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
