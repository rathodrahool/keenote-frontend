import React, { useState } from 'react';
import {
  HomeIcon,
  FolderIcon,
  ClockIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const SidebarLink = ({ icon, label, isActive = false, isCollapsed = false }: SidebarLinkProps) => (
  <a 
    href="#" 
    className={`
      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
      transition-all duration-200 ease-in-out relative whitespace-nowrap
      ${isActive 
        ? 'bg-emerald-50 text-emerald-600' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
  >
    <div className={`
      flex-shrink-0 min-w-[20px]
      ${isActive ? 'text-emerald-600' : 'text-gray-500'}
    `}>
      {icon}
    </div>
    <span className={`
      ml-3 transition-all duration-300
      ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
    `}>
      {label}
    </span>
    {isCollapsed && (
      <div className="
        absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs
        rounded opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none whitespace-nowrap z-50
      ">
        {label}
      </div>
    )}
  </a>
);

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`
      fixed h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      overflow-visible
    `}>
      <div className="flex flex-col h-full">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full border border-gray-200
            flex items-center justify-center text-gray-500 hover:text-gray-700
            transition-colors duration-200 shadow-md z-50 hover:bg-gray-50"
        >
          {isCollapsed ? 
            <ChevronRightIcon className="w-4 h-4" /> : 
            <ChevronLeftIcon className="w-4 h-4" />
          }
        </button>

        <div className="flex flex-col h-full justify-between">
          <nav className="px-3 py-4 space-y-1">
            <SidebarLink icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" isCollapsed={isCollapsed} />
            <SidebarLink icon={<FolderIcon className="w-5 h-5" />} label="Categories" isActive={true} isCollapsed={isCollapsed} />
            <SidebarLink icon={<ClockIcon className="w-5 h-5" />} label="Tasks" isCollapsed={isCollapsed} />
            <SidebarLink icon={<ChartBarSquareIcon className="w-5 h-5" />} label="Reports" isCollapsed={isCollapsed} />
          </nav>
          
          <div className="mt-auto border-t border-gray-200">
            <div className="px-3 py-4">
              <SidebarLink icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" isCollapsed={isCollapsed} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
