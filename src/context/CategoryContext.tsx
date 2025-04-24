import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Category, CategoryContextType, CreateCategoryDto, PaginationMeta } from '../types/category';
import { useCategoryService } from '../hooks/useCategoryService';
import { ApiError } from '../services/api/BaseApiService';
import { useToast } from './ToastContext';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const { addToast } = useToast();
  const {
    getCategories,
    createCategory: apiCreateCategory,
    updateCategory: apiUpdateCategory,
    deleteCategory: apiDeleteCategory,
    archiveCategory: apiArchiveCategory,
    unarchiveCategory: apiUnarchiveCategory,
  } = useCategoryService();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCategories({
        search: searchTerm,
        order: {
          [sortBy === 'name' ? 'name' : 'created_at']: 'asc'
        }
      });
      setCategories(response.data || []);
      setPagination(response.meta || null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      setCategories([]); // Reset categories on error
    } finally {
      setIsLoading(false);
    }
  }, [getCategories, searchTerm, sortBy, addToast]);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCategories();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchCategories]);

  const filteredAndSortedCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    
    return categories
      .filter(cat => 
        cat && cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [categories, searchTerm, sortBy]);

  const addCategory = async (categoryData: CreateCategoryDto) => {
    try {
      const response = await apiCreateCategory(categoryData);
      setCategories(prev => [...prev, response.data]);
      setError(null);
      addToast({
        type: 'success',
        message: 'Category added successfully!'
      });
      // Refresh the list to ensure consistency
      fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create category';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const updateCategory = async (id: string, updatedData: Partial<CreateCategoryDto>) => {
    try {
      const response = await apiUpdateCategory(id, updatedData);
      setCategories(prev =>
        prev.map(category =>
          category._id === id ? response.data : category
        )
      );
      setError(null);
      addToast({
        type: 'success',
        message: 'Category updated successfully!'
      });
      // Refresh the list to ensure consistency
      fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update category';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const archiveCategory = async (id: string) => {
    try {
      const response = await apiArchiveCategory(id);
      setCategories(prev =>
        prev.map(category =>
          category._id === id ? response.data : category
        )
      );
      setError(null);
      addToast({
        type: 'success',
        message: 'Category archived successfully!'
      });
      // Refresh the list to ensure consistency
      fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to archive category';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const unarchiveCategory = async (id: string) => {
    try {
      const response = await apiUnarchiveCategory(id);
      setCategories(prev =>
        prev.map(category =>
          category._id === id ? response.data : category
        )
      );
      setError(null);
      addToast({
        type: 'success',
        message: 'Category unarchived successfully!'
      });
      // Refresh the list to ensure consistency
      fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to unarchive category';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await apiDeleteCategory(id);
      setCategories(prev => prev.filter(category => category._id !== id));
      setError(null);
      addToast({
        type: 'success',
        message: 'Category deleted successfully!'
      });
      // Refresh the list to ensure consistency
      fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete category';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: filteredAndSortedCategories,
        addCategory,
        updateCategory,
        archiveCategory,
        unarchiveCategory,
        deleteCategory,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        isLoading,
        error,
        pagination,
        setPagination,
        refreshCategories: fetchCategories,
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
