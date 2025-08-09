import { inject, injectable } from "inversify";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { ICategory } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { TYPES } from "../../core/types";
import { FilterQuery } from "mongoose";
import { IAdminCategoryService } from "../../core/interfaces/services/admin/IAdminCategoryService";
import { Messages } from "../../constants/messages";
@injectable()
export class AdminCategoryService implements IAdminCategoryService {
  constructor(
    @inject(TYPES.CategoriesRepository) private categoryRepo: ICategoriesRepository
  ) {}

  async addCategory(title: string, description: string): Promise<ICategory> {
    const existCategory = await this.categoryRepo.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });

    if (existCategory) {
      throwError(Messages.CATEGORY.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }

    return await this.categoryRepo.create({ title, description });
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepo.findAll();
  }

  async getCategories(
    page = 1,
    limit = 10,
    search?: string,
    filters: FilterQuery<ICategory> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICategory[]; total: number; totalPages?: number }> {
    const result = await this.categoryRepo.findPaginated(filters, page, limit, search, sort);
    if (!result.data) throwError(Messages.CATEGORY.FAILED_TO_FETCH, StatusCode.INTERNAL_SERVER_ERROR);;
    return result;
  }

  async editCategory(categoryId: string, title: string, description: string): Promise<ICategory> {
    if (!categoryId || !title.trim() || !description.trim()) {
      throwError(Messages.CATEGORY.INVALID_INPUT, StatusCode.BAD_REQUEST);
    }

    const existingCategory = await this.categoryRepo.findById(categoryId);
    if (!existingCategory) throwError(Messages.CATEGORY.NOT_FOUND, StatusCode.NOT_FOUND);


    const updated = await this.categoryRepo.update(categoryId, {
      title,
      description,
      updatedAt: new Date()
    });

    if (!updated) throwError(Messages.CATEGORY.FAILED_TO_UPDATE, StatusCode.INTERNAL_SERVER_ERROR);
    return updated;
  }

  async blockCategory(id: string, isBlock: boolean): Promise<void> {
    const updated = await this.categoryRepo.update(id, { isBlock });
    if (!updated) throwError(Messages.CATEGORY.FAILED_TO_UPDATE_STATUS, StatusCode.INTERNAL_SERVER_ERROR);
  }
}