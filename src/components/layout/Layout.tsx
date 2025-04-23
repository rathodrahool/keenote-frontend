import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out"
          style={{ marginLeft: "16rem" }} // This will be controlled by JavaScript
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
