import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICategory, ICourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { IAdminCategoriesRepostory } from "../../core/interfaces/repositories/admin/IAdminCategoryRepository";
import { throwError } from "../../utils/ResANDError";
import { IAdminCourserRepository } from "../../core/interfaces/repositories/admin/IAdminCourseRepository";
@injectable()
class AdminCourseServices implements IAdminCourseServices{
    constructor( @inject(TYPES.AdminCourseRepository) private courseRepo: IAdminCourserRepository,
    @inject(TYPES.AdminCategoriesRepository) private categoryRepo: IAdminCategoriesRepostory
    ) { }
    createClass(data: Partial<ICourse>): void {
        
    }
    async addCategories(title: string, description: string): Promise<ICategory> {
        const existCategory = await this.categoryRepo.findOne({ title });
        if (existCategory) throwError("This categorie already added");
        const newData = this.categoryRepo.create({ title, description })
        return newData
    }
    async getCategory(): Promise<ICategory[]> {
        const categories = this.categoryRepo.findAll();
        return categories
    }
    async blockCategory(id:string,status:boolean): Promise<void> {
        this.categoryRepo.update(id,{isBlock:status})
    }

}
export default AdminCourseServices