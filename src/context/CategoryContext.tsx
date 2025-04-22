import React, { createContext, useContext, useState, useMemo } from 'react';
import { Category, CategoryContextType } from '../types/category';
import { v4 as uuidv4 } from 'uuid';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Work',
      color: '#10B981',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Personal',
      color: '#3B82F6',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Shopping',
      color: '#F59E0B',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  const filteredAndSortedCategories = useMemo(() => {
    return categories
      .filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }, [categories, searchTerm, sortBy]);

  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedData: Partial<Category>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id
          ? { ...category, ...updatedData, updatedAt: new Date() }
          : category
      )
    );
  };

  const archiveCategory = (id: string) => {
    updateCategory(id, { isArchived: true });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: filteredAndSortedCategories,
        addCategory,
        updateCategory,
        archiveCategory,
        deleteCategory,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
