
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import CategoryModel from "../../models/class/CategoriesModel";
import { ICategory } from "../../types/classTypes";
import { BaseRepository } from "../baseRepository";

export class CategoriesRepository extends BaseRepository<ICategory , ICategory> implements ICategoriesRepository{
    constructor() {
        super(CategoryModel)
    }
}