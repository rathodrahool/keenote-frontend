import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  isCollapsed?: boolean;
}

const SidebarLink = ({ icon, label, to, isCollapsed = false }: SidebarLinkProps & { to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to}
      className={`
        group flex items-center px-5 py-3 text-sm font-medium
        transition-all duration-150 ease-in-out relative
        ${isActive 
          ? 'bg-emerald-50/80 text-emerald-600 border-l-[3px] border-emerald-500' 
          : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 border-l-[3px] border-transparent'
        }
      `}
    >
      <div className={`
        flex-shrink-0 transition-colors duration-150 w-5 h-5 flex items-center justify-center
        ${isActive 
          ? 'text-emerald-600' 
          : 'text-gray-400 group-hover:text-gray-600'
        }
      `}>
        {icon}
      </div>
      <span className={`
        ml-3.5 font-medium transition-all duration-150 whitespace-nowrap
        ${isCollapsed ? 'opacity-0 w-0 -translate-x-2' : 'opacity-100 w-auto translate-x-0'}
        ${isActive ? 'text-emerald-600' : 'text-gray-600 group-hover:text-gray-900'}
      `}>
        {label}
      </span>
    </Link>
  );
};

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
            <SidebarLink icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" to="/" isCollapsed={isCollapsed} />
            <SidebarLink icon={<FolderIcon className="w-5 h-5" />} label="Categories" to="/categories" isCollapsed={isCollapsed} />
            <SidebarLink icon={<ClockIcon className="w-5 h-5" />} label="Tasks" to="/tasks" isCollapsed={isCollapsed} />
            <SidebarLink icon={<ChartBarSquareIcon className="w-5 h-5" />} label="Reports" to="/reports" isCollapsed={isCollapsed} />
          </nav>
          
          <div className="mt-auto border-t border-gray-200">
            <div className="px-3 py-4">
              <SidebarLink icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" to="/settings" isCollapsed={isCollapsed} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
