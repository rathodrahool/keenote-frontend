import React from 'react';

export const Navbar = () => {
  return (
    <nav className="h-16 bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="h-full mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center px-8">
          <span className="text-2xl font-semibold text-emerald-600">Keenote</span>
        </div>
        <div className="flex items-center px-8">
          <button 
            aria-label="Profile" 
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
