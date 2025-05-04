import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICategory, ICourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { IAdminCategoriesRepostory } from "../../core/interfaces/repositories/admin/IAdminCategoryRepository";
import { throwError } from "../../utils/ResANDError";
import { IAdminCourserRepository } from "../../core/interfaces/repositories/admin/IAdminCourseRepository";
import { uploadToCloudinary } from "../../utils/cloudImage";
import { validateCoursePayload } from "../../validation/adminValidation";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { ObjectId } from "mongoose";
@injectable()
class AdminCourseServices implements IAdminCourseServices{
    constructor( @inject(TYPES.AdminCourseRepository) private courseRepo: IAdminCourserRepository,
      @inject(TYPES.AdminCategoriesRepository) private categoryRepo: IAdminCategoriesRepostory,
    @inject(TYPES.AdminMentorRepository )private mentorRepo:IAdminMentorRepository
    ) { }
   
    async addCategories(title: string, description: string): Promise<ICategory> {
        const existCategory = await this.categoryRepo.findOne({ title });
        if (existCategory) throwError("This categorie already added");
        const newData = this.categoryRepo.create({ title, description });
        return newData
    }
    async getCategory(): Promise<ICategory[]> {
        const categories = this.categoryRepo.findAll();
        if (!categories) throwError("Failed to fetch categories", 500);
        return categories;
    }
    async blockCategory(id:string,status:boolean): Promise<void> {
        const updated=this.categoryRepo.update(id, { isBlock: status });
        if (!updated) throwError("Failed to update category status", 500);

    }
    
    async createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourse> {
      validateCoursePayload(data, thumbnail);
      if (!data.mentorId) throw new Error("Mentor ID is required");
      const courses = await this.courseRepo.findAll({ mentorId: data.mentorId });

      const hasOverlap = courses.some((course) => {
        return (
          course.startDate &&
          course.endDate &&
          data.startDate &&
          data.endDate &&
          course.startDate <= data.endDate &&
          course.endDate >= data.startDate
        );
      });
      
      if (hasOverlap) {
        throwError("This mentor already has a class at the same time.");
      }
      
      const imageUrl = await uploadToCloudinary(thumbnail, "thumbnail");

        const courseData: Partial<ICourse> = {
          ...data,
          thumbnail: imageUrl,
        };
      
      const createdCourse = await this.courseRepo.create(courseData);
      
      if (!createdCourse) throwError("Failed to create course", 500);
       
        return createdCourse;
    }
    async getClass(): Promise<ICourse[]> {
        const courses = await this.courseRepo.findAll();
        if (!courses) throwError("Failed to fetch courses", 500);
        return courses;
      }
  async blockCourse(id: string, status: boolean): Promise<void> {
      console.log(id)
        if (!id || id.length !== 24) throwError("Invalid course ID", 400);
    
        const updated = await this.courseRepo.update(id, { isBlock: status });
        if (!updated) throwError("Failed to update course status", 500);
     }
    

}
export default AdminCourseServices