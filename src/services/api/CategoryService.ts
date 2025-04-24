import { BaseApiService } from './BaseApiService';
import { API_ENDPOINTS } from '../../config/api.config';
import { Category, CreateCategoryDto, ApiResponse, FindAllQuery } from '../../types/category';

export class CategoryService extends BaseApiService {
  private static instance: CategoryService;

  private constructor() {
    super();
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  private buildQueryString(query: FindAllQuery): string {
    const params = new URLSearchParams();
    
    if (query.search) {
      params.append('search', query.search);
    }
    
    if (query.page) {
      params.append('page', query.page.toString());
    }
    
    if (query.limit) {
      params.append('limit', query.limit.toString());
    }
    
    if (query.order) {
      Object.entries(query.order).forEach(([key, value]) => {
        params.append(`order[${key}]`, value.toString());
      });
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getCategories(query?: FindAllQuery): Promise<ApiResponse<Category[]>> {
    const queryString = this.buildQueryString(query || {});
    return this.get<ApiResponse<Category[]>>(`${API_ENDPOINTS.category}${queryString}`);
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.get<ApiResponse<Category>>(`${API_ENDPOINTS.category}/${id}`);
  }

  async createCategory(category: CreateCategoryDto): Promise<ApiResponse<Category>> {
    return this.post<ApiResponse<Category>>(API_ENDPOINTS.category, category);
  }

  async updateCategory(id: string, category: Partial<CreateCategoryDto>): Promise<ApiResponse<Category>> {
    return this.patch<ApiResponse<Category>>(`${API_ENDPOINTS.category}/${id}`, category);
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${API_ENDPOINTS.category}/${id}`);
  }

  async archiveCategory(id: string): Promise<ApiResponse<Category>> {
    return this.patch<ApiResponse<Category>>(`${API_ENDPOINTS.category}/${id}/archive`, { is_archived: true });
  }

  async unarchiveCategory(id: string): Promise<ApiResponse<Category>> {
    return this.patch<ApiResponse<Category>>(`${API_ENDPOINTS.category}/${id}/archive`, { is_archived: false });
  }
} 