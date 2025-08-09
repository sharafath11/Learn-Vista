import { inject, injectable } from "inversify";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { ICategory } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { TYPES } from "../../core/types";
import { FilterQuery } from "mongoose";
import { IAdminCategoryService } from "../../core/interfaces/services/admin/IAdminCategoryService";
import { Messages } from "../../constants/messages";
import { CategoryMapper } from "../../shared/dtos/categories/category.mapper";
import { ICategoryResponseDto } from "../../shared/dtos/categories/category-response.dto";
@injectable()
export class AdminCategoryService implements IAdminCategoryService {
  constructor(
    @inject(TYPES.CategoriesRepository) private categoryRepo: ICategoriesRepository
  ) {}

  async addCategory(title: string, description: string): Promise<ICategoryResponseDto> {
    const existCategory = await this.categoryRepo.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });

    if (existCategory) {
      throwError(Messages.CATEGORY.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }

    const result = await this.categoryRepo.create({ title, description });
    return CategoryMapper.toResponseDto(result)
  }
async getAllCategories(): Promise<ICategoryResponseDto[]> {
  const result = await this.categoryRepo.findAll();
  return result.map((i) => CategoryMapper.toResponseDto(i));
}


async getCategories(
  page = 1,
  limit = 10,
  search?: string,
  filters: FilterQuery<ICategory> = {},
  sort: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<{ data: ICategoryResponseDto[]; total: number; totalPages: number }> {
  const result = await this.categoryRepo.findPaginated(filters, page, limit, search, sort);

  if (!result.data || result.data.length === 0) {
    throwError(Messages.CATEGORY.FAILED_TO_FETCH, StatusCode.INTERNAL_SERVER_ERROR);
  }

  return {
    ...result,
    data: result.data.map(CategoryMapper.toResponseDto),
  };
}


  async editCategory(categoryId: string, title: string, description: string): Promise<ICategoryResponseDto> {
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
    return CategoryMapper.toResponseDto(updated);
  }

async blockCategory(id: string, isBlock: boolean): Promise<ICategoryResponseDto> {
  const updated = await this.categoryRepo.update(id, { isBlock });
  if (!updated) throwError(Messages.CATEGORY.FAILED_TO_UPDATE_STATUS, StatusCode.INTERNAL_SERVER_ERROR);
  return CategoryMapper.toResponseDto(updated);
}

}