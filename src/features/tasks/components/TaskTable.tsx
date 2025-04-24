import React, { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClipboardIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Task, TaskType, TaskFrequency, Status } from '../../../types/task';
import { useCategories } from '../../../context/CategoryContext';
import { TimeTracker } from './TimeTracker';
import { useTasks } from '../../../context/TaskContext';
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '../../../components/common/Button';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleCompletion?: (taskId: string) => void;
}

type SortField = 'name' | 'category' | 'task_type' | 'task_frequency' | 'status' | 'start_date';
type SortOrder = 'asc' | 'desc';

export const TaskTable = ({ tasks, onEdit, onDelete, onToggleCompletion }: TaskTableProps) => {
  const { categories } = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('start_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Sorting and filtering
  const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (!task) return false;
      
      const taskNameMatch = task.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const categoryNameMatch = task.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      return taskNameMatch || categoryNameMatch;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      let compareA, compareB;
      
      switch (sortField) {
        case 'category':
          compareA = a.category?.name || '';
          compareB = b.category?.name || '';
          break;
        case 'start_date':
          return sortOrder === 'asc' 
            ? new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            : new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
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
      case Status.ACTIVE: return 'bg-green-100 text-green-800';
      case Status.INACTIVE: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyBadge = (frequency: Task['task_frequency']) => {
    const colors = {
      [TaskFrequency.DAILY]: 'bg-blue-50 text-blue-700',
      [TaskFrequency.WEEKLY]: 'bg-purple-50 text-purple-700',
      [TaskFrequency.MONTHLY]: 'bg-orange-50 text-orange-700'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[frequency]}`}>
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </span>
    );
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            disabled
            className="border border-gray-300 px-3 py-2 w-64 bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div className="rounded-lg p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <ClipboardIcon className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              Create your first task to start tracking your progress
            </p>
            <Button 
              onClick={() => window.dispatchEvent(new CustomEvent('openAddTaskModal'))} 
              className="mt-4"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-64 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{task.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: task.category?.color }}
                    />
                    <span>{task.category?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-900">
                      {task.task_type === TaskType.TIME_BASED 
                        ? `${task.duration} min goal`
                        : `${task.target}x per day`
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.task_type === TaskType.TIME_BASED ? 'Time-based' : 'Completion-based'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.task_type === TaskType.TIME_BASED ? (
                    <TimeTracker
                      task={task}
                      onStartTimer={(taskId) => {
                        // TODO: Implement timer start functionality
                        console.log('Start timer for task:', taskId);
                      }}
                      onStopTimer={(taskId) => {
                        // TODO: Implement timer stop functionality
                        console.log('Stop timer for task:', taskId);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {task.target || 0}/{task.target} today
                      </span>
                      {onToggleCompletion && (
                        <button
                          onClick={() => onToggleCompletion(task._id)}
                          disabled={task.target === 0}
                          className={`p-2 rounded-full ${
                            task.target === 0
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
                  {getFrequencyBadge(task.task_frequency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, tasks.length)}
                </span>{' '}
                of <span className="font-medium">{tasks.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!taskToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskName={taskToDelete?.name || ''}
      />
    </div>
  );
};
