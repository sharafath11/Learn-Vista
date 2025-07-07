
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import CategoryModel from "../../models/mentor/class/categoriesModel";
import { ICategory } from "../../types/classTypes";
import { BaseRepository } from "../BaseRepository";

export class CategoriesRepository extends BaseRepository<ICategory , ICategory> implements ICategoriesRepository{
    constructor() {
        super(CategoryModel)
    }
}