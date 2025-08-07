import { ICategory } from "../../../../types/classTypes";
export interface IAdminCategoryService {
  addCategory(title: string, description: string): Promise<ICategory>;
  getAllCategories(): Promise<ICategory[]>;
  getCategories(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICategory[]; total: number; totalPages?: number }>;
  blockCategory(id: string, status: boolean): Promise<void>;
  editCategory(categoryId: string, title: string, description: string): Promise<ICategory>;
}
