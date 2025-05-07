import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICategory, ICourse, IPopulatedCourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { IAdminCategoriesRepostory } from "../../core/interfaces/repositories/admin/IAdminCategoryRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
import { uploadToCloudinary } from "../../utils/cloudImage";
import { validateCoursePayload } from "../../validation/adminValidation";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminCourseServices implements IAdminCourseServices {
  constructor(
    @inject(TYPES.AdminCategoriesRepository)
    private categoryRepo: IAdminCategoriesRepostory,

    @inject(TYPES.AdminMentorRepository)
    private mentorRepo: IAdminMentorRepository,

    @inject(TYPES.CourseRepository)
    private baseCourseRepo: ICourseRepository
  ) {}

  async addCategories(title: string, description: string): Promise<ICategory> {
    const existCategory = await this.categoryRepo.findOne({ title });
    if (existCategory) throwError("This category already exists", StatusCode.BAD_REQUEST);

    const newData = await this.categoryRepo.create({ title, description });
    return newData;
  }

  async getCategory(): Promise<ICategory[]> {
    const categories = await this.categoryRepo.findAll();
    if (!categories) throwError("Failed to fetch categories", StatusCode.INTERNAL_SERVER_ERROR);

    return categories;
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

  async getClass(): Promise<IPopulatedCourse[]> {
    const courses = await this.baseCourseRepo.populateWithAllFildes();
    if (!courses) throwError("Failed to fetch courses", StatusCode.INTERNAL_SERVER_ERROR);

    return courses;
  }

  async blockCourse(id: string, status: boolean): Promise<void> {
    if (!id || id.length !== 24) throwError("Invalid course ID", StatusCode.BAD_REQUEST);

    const updated = await this.baseCourseRepo.update(id, { isBlock: status });
    if (!updated) throwError("Failed to update course status", StatusCode.INTERNAL_SERVER_ERROR);
  }
}

export default AdminCourseServices;
