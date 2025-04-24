export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  is_archived: boolean;
  status: Status;
  deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  is_archived?: boolean;
  status?: Status;
}

export interface PaginationMeta {
  total: number;
  page: number | null;
  limit: number;
  totalPages: number | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface FindAllQuery {
  search?: string;
  order?: { [key: string]: 'asc' | 'desc' | 1 | -1 };
  page?: number;
  limit?: number;
}

export interface CategoryContextType {
  categories: Category[];
  addCategory: (category: CreateCategoryDto) => Promise<void>;
  updateCategory: (id: string, category: Partial<CreateCategoryDto>) => Promise<void>;
  archiveCategory: (id: string) => Promise<void>;
  unarchiveCategory: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'name' | 'date';
  setSortBy: (sort: 'name' | 'date') => void;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  setPagination: (pagination: PaginationMeta) => void;
  refreshCategories: () => Promise<void>;
}
