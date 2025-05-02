import { injectable } from "inversify";
import { ICategory } from "../../types/classTypes";
import { BaseRepository } from "../BaseRepository";
import CategoryModel from "../../models/class/categoriesModel";
import { IAdminCategoriesRepostory } from "../../core/interfaces/repositories/admin/IAdminCategoryRepository";

@injectable()
export class AdminCategoriesRepo extends BaseRepository<ICategory, ICategory> implements IAdminCategoriesRepostory {
    constructor() {
      super(CategoryModel);
    }
  }