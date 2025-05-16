import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICategory, ICourse, IPopulatedCourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { IAdminCategoriesRepostory } from "../../core/interfaces/repositories/admin/IAdminCategoryRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudImage";
import { validateCoursePayload } from "../../validation/adminValidation";
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { CourseRepository } from "../../repositories/course/CourseRepository";
import { IAdminCourserRepository } from "../../core/interfaces/repositories/admin/IAdminCourseRepository";

@injectable()
class AdminCourseServices implements IAdminCourseServices {
  constructor(
    @inject(TYPES.AdminCategoriesRepository)
    private categoryRepo: IAdminCategoriesRepostory,

    @inject(TYPES.AdminMentorRepository)
    private mentorRepo: IAdminMentorRepository,
    @inject(TYPES.AdminCourseRepository) private adminCourseRepo:IAdminCourserRepository,

    @inject(TYPES.CourseRepository)
    private baseCourseRepo: ICourseRepository
  ) {}

  async addCategories(title: string, description: string): Promise<ICategory> {
    const existCategory = await this.categoryRepo.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });
    if (existCategory) {
      throwError("This category already exists", StatusCode.BAD_REQUEST);
    }
    const newData = await this.categoryRepo.create({ title, description });
    return newData;
  }

  async getCategory(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters: FilterQuery<ICategory> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICategory[]; total: number; totalPages?: number }>{
    const { data, total, totalPages } = await this.categoryRepo.findPaginated(
      filters,   
      page,     
      limit,   
      search,   
      
      sort      
    );
    if (!data) throwError("Failed to fetch categories", StatusCode.INTERNAL_SERVER_ERROR);

    return {data,total,totalPages};
  }

  async blockCategory(id: string, status: boolean): Promise<void> {
    const updated = await this.categoryRepo.update(id, { isBlock: status });
    if (!updated) throwError("Failed to update category status", StatusCode.INTERNAL_SERVER_ERROR);
  }

  async createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourse> {
    validateCoursePayload(data, thumbnail);

    if (!data.mentorId) throwError("Mentor ID is required", StatusCode.BAD_REQUEST);

    const courses = await this.baseCourseRepo.findAll({ mentorId: data.mentorId });

    const hasOverlap = courses.some(course =>
      course.startDate &&
      course.endDate &&
      data.startDate &&
      data.endDate &&
      course.startDate <= data.endDate &&
      course.endDate >= data.startDate
    );

    if (hasOverlap) {
      throwError("This mentor already has a class at the same time.", StatusCode.BAD_REQUEST);
    }

    const imageUrl = await uploadToCloudinary(thumbnail, "thumbnail");

    const courseData: Partial<ICourse> = {
      ...data,
      thumbnail: imageUrl,
    };

    const createdCourse = await this.baseCourseRepo.create(courseData);
    if (!createdCourse) throwError("Failed to create course", StatusCode.INTERNAL_SERVER_ERROR);

    return createdCourse;
  }
  async editCourseService(
    courseId: string,
    data: Partial<ICourse>,
    thumbnail?: Buffer
  ): Promise<ICourse> {
    const currentCourse = await this.baseCourseRepo.findById(courseId);
    if (!currentCourse) {
      throwError("Course not found", StatusCode.NOT_FOUND);
    }
  
    const updateData: Partial<ICourse> = { ...data };
  
    const newMentorId = data.mentorId || currentCourse.mentorId;
    const isMentorChanged = !!data.mentorId && data.mentorId !== currentCourse.mentorId;
  
    const isTimeChanged = (!!data.startTime && data.startTime !== currentCourse.startTime);
  
    if (isMentorChanged || isTimeChanged) {
      const startDate = data.startDate ?? currentCourse.startDate;
      const endDate = data.endDate ?? currentCourse.endDate;
      const startTime = data.startTime ?? currentCourse.startTime;
  
      if (!startDate || !endDate || !startTime) {
        throwError("Incomplete scheduling data", StatusCode.BAD_REQUEST);
      }
  
      const existingCourses = await this.baseCourseRepo.findAll({ mentorId: newMentorId });
  
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
  
      const hasConflict = existingCourses.some(course => {
        if (course.id === courseId) return false;
        if (!course.startDate || !course.endDate || !course.startTime) return false;
  
        const courseStart = new Date(course.startDate);
        const courseEnd = new Date(course.endDate);
  
        const isDateOverlap = newStart <= courseEnd && newEnd >= courseStart;
        const isTimeOverlap = course.startTime === startTime;
  
        return isDateOverlap && isTimeOverlap;
      });
  
      if (hasConflict) {
        throwError("Mentor already has a course at this time", StatusCode.CONFLICT);
      }
  
      if (isMentorChanged) {
        updateData.mentorStatus = "pending";
      }
    }
  
    if (thumbnail) {
      updateData.thumbnail = await uploadToCloudinary(thumbnail, "thumbnail");
  
      if (currentCourse.thumbnail) {
        await deleteFromCloudinary(currentCourse.thumbnail).catch(err =>
          console.error("Failed to delete old thumbnail:", err)
        );
      }
    }
  
    const updatedCourse = await this.baseCourseRepo.update(courseId, updateData);
    if (!updatedCourse) {
      throwError("Failed to update course", StatusCode.INTERNAL_SERVER_ERROR);
    }
  
    return updatedCourse;
  }
   
  

async editCategories(categoryId: string, title: string, description: string): Promise<ICategory> {
    if (!categoryId || !title.trim() || !description.trim()) throwError("Invalid input parameters");
    const existCategory = await this.categoryRepo.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });
    if (existCategory) {
      throwError("This category already exists", StatusCode.BAD_REQUEST);
    }
    const updateData = { title, description, updatedAt: new Date() };
    const existingCategory = await this.categoryRepo.findById(categoryId);
    if (!existingCategory) throwError("Category not found");
    
    const updatedCategory = await this.categoryRepo.update(categoryId, updateData);
    if (!updatedCategory) throwError("Failed to update category");
    
    return updatedCategory;
}
  async getClass(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters: FilterQuery<ICourse> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICourse[]; total: number; totalPages?: number }> {
   
    const { data, total, totalPages } = await this.adminCourseRepo.getClassRepo(
      page,     
      limit,   
      search,   
      filters,   
      sort      
    );
  
    if (!data) throwError("Failed to fetch courses", StatusCode.INTERNAL_SERVER_ERROR);
  
    return {
      data,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  
  async blockCourse(id: string, status: boolean): Promise<void> {
    if (!id || id.length !== 24) throwError("Invalid course ID", StatusCode.BAD_REQUEST);

    const updated = await this.baseCourseRepo.update(id, { isBlock: status });
    if (!updated) throwError("Failed to update course status", StatusCode.INTERNAL_SERVER_ERROR);
  }
}

export default AdminCourseServices;
