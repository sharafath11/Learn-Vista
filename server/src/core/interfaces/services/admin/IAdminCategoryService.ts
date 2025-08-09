import { ICategoryResponseDto } from "../../../../shared/dtos/categories/category-response.dto";
import { ICategory } from "../../../../types/classTypes";
export interface IAdminCategoryService {
  addCategory(title: string, description: string): Promise<ICategoryResponseDto>;
  getAllCategories(): Promise<ICategoryResponseDto[]>;
  getCategories(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICategoryResponseDto[]; total: number; totalPages?: number }>;
  blockCategory(id: string, status: boolean): Promise<ICategoryResponseDto>;
  editCategory(categoryId: string, title: string, description: string): Promise<ICategoryResponseDto>;
}
