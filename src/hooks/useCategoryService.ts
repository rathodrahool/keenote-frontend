import { useCallback } from 'react';
import { CategoryService } from '../services/api/CategoryService';
import { Category, CreateCategoryDto, ApiResponse, FindAllQuery } from '../types/category';

export const useCategoryService = () => {
  const categoryService = CategoryService.getInstance();

  const getCategories = useCallback(async (query?: FindAllQuery): Promise<ApiResponse<Category[]>> => {
    return categoryService.getCategories(query);
  }, []);

  const getCategory = useCallback(async (id: string): Promise<ApiResponse<Category>> => {
    return categoryService.getCategory(id);
  }, []);

  const createCategory = useCallback(async (
    category: CreateCategoryDto
  ): Promise<ApiResponse<Category>> => {
    return categoryService.createCategory(category);
  }, []);

  const updateCategory = useCallback(async (
    id: string,
    category: Partial<CreateCategoryDto>
  ): Promise<ApiResponse<Category>> => {
    return categoryService.updateCategory(id, category);
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    return categoryService.deleteCategory(id);
  }, []);

  const archiveCategory = useCallback(async (id: string): Promise<ApiResponse<Category>> => {
    return categoryService.archiveCategory(id);
  }, []);

  const unarchiveCategory = useCallback(async (id: string): Promise<ApiResponse<Category>> => {
    return categoryService.unarchiveCategory(id);
  }, []);

  return {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    archiveCategory,
    unarchiveCategory,
  };
}; 