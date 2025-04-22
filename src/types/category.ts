export interface Category {
  id: string;
  name: string;
  color: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  archiveCategory: (id: string) => void;
  deleteCategory: (id: string) => void;
}
