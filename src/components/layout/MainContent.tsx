import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 ml-64 p-6">
      {children}
    </main>
  );
};
