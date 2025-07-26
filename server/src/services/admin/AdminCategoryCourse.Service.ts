import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICategory, ICourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
import { uploadThumbnail, deleteFromS3 } from "../../utils/s3Utilits";
import { validateCoursePayload } from "../../validation/adminValidation";
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { IConcern } from "../../types/concernTypes";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";

@injectable()
class AdminCourseServices implements IAdminCourseServices {
  constructor(
    @inject(TYPES.CategoriesRepository)
    private categoryRepo: ICategoriesRepository,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository,
    @inject(TYPES.CourseRepository)
    private baseCourseRepo: ICourseRepository,
    @inject(TYPES.ConcernRepository) private _concernRepo: IConcernRepository,
    @inject(TYPES.NotificationService) private _notificationService:INotificationService

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
      throwError("This mentor already has a class at the same date.", StatusCode.BAD_REQUEST);
    }

    const imageUrl = await uploadThumbnail(thumbnail);

    const courseData: Partial<ICourse> = {
      ...data,
      thumbnail: imageUrl,
    };

    const createdCourse = await this.baseCourseRepo.create(courseData);
    if (!createdCourse) throwError("Failed to create course", StatusCode.INTERNAL_SERVER_ERROR);
      await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [createdCourse.mentorId.toString()],
      roles:["user"],
      title: "Course Updated",
      message: `New course "${createdCourse.title}" has been Started.`,
      type: "info",
    });
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
    }

    if (thumbnail) {
      if (currentCourse.thumbnail) {
        await deleteFromS3(currentCourse.thumbnail).catch(err =>
          console.error("Failed to delete old thumbnail:", err)
        );
      }
      updateData.thumbnail = await uploadThumbnail(thumbnail);
    }

    const updatedCourse = await this.baseCourseRepo.update(courseId, updateData);
    if (!updatedCourse) {
      throwError("Failed to update course", StatusCode.INTERNAL_SERVER_ERROR);
    }
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [updatedCourse.mentorId.toString()],
    title: "Course Updated",
    message: `Your course "${updatedCourse.title}" has been updated by the admin.`,
    type: "info",
   });

    return updatedCourse;
  }

  async getAllCategory(): Promise<ICategory[]> {
    const result = await this.categoryRepo.findAll()
    return result
  }

async editCategories(categoryId: string, title: string, description: string): Promise<ICategory> {
    if (!categoryId || !title.trim() || !description.trim()) throwError("Invalid input parameters");

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

    const { data, total, totalPages } = await this._courseRepo.AdmingetClassRepo(
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

  async blockCourse(id: string, isBlock: boolean): Promise<void> {
  if (!id || id.length !== 24) {
    throwError("Invalid course ID", StatusCode.BAD_REQUEST);
  }
  const updated = await this.baseCourseRepo.update(id, { isBlock });
  if (!updated) {
    throwError("Failed to update course status", StatusCode.INTERNAL_SERVER_ERROR);
  }
  const statusText = isBlock ? "blocked" : "unblocked";

  if (!updated.mentorId) {
    throwError("No mentor associated with this course", StatusCode.NOT_FOUND);
  }
  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [
      updated.mentorId.toString(),
      ...(Array.isArray(updated.enrolledUsers)
        ? updated.enrolledUsers.map((id) => id.toString())
        : []),
    ],
    title: ` Course ${statusText}`,
    message: `Your ${updated.title} course has been ${statusText} by the admin.`,
    type: isBlock ? "error" : "success",
  });
}

  async getConcern(): Promise<IConcern[]> {
    const result = await this._concernRepo.findAll();
    if (!result) throwError("Somthing wrong");
    return result
  }
 async updateConcernStatus(
  concernId: string,
  status: 'resolved' | 'in-progress',
  resolution: string
 ): Promise<void> {

  const concern = await this._concernRepo.findById(concernId);
  if (!concern) throwError("Concern not found");
  const updated = await this._concernRepo.update(concernId, {
    status,
    resolution,
    updatedAt: new Date()
  });
   if (concern.mentorId) {
    const statusText = status === "resolved" ? "resolved" : "marked as in-progress";

    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [concern.mentorId.toString()],
      title: status === "resolved" ? " Concern Resolved" : " Concern In-Progress",
      message: `Your concern titled "${concern.title}" has been ${statusText} by the admin.`,
      type: status === "resolved" ? "success" : "info",
    });
  }
  if (!updated) throwError("Failed to update concern status");
}
async updateConcern(concernId: string, updateData: Partial<IConcern>): Promise<void> {
  const concern = await this._concernRepo.findById(concernId);
  if (!concern) throwError("Concern not found");

  const updated = await this._concernRepo.update(concernId, {
    ...updateData,
    updatedAt: new Date()
  });

  if (!updated) throwError("Failed to update concern");
}
async getAllConcerns(
  filters: {
    status?: 'open' | 'in-progress' | 'resolved';
    courseId?: string;
    search?: string;
  },
  limit: number,
  skip: number,
  sort: Record<string, 1 | -1>
): Promise<{ concerns: IConcern[]; courses: ICourse[] }> {
  const query: FilterQuery<IConcern> = {};

  if (filters.status) query.status = filters.status;
  if (filters.courseId) query.courseId = filters.courseId;

  if (filters.search && filters.search.trim()) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { message: { $regex: filters.search, $options: "i" } }
    ];
  }

  const concerns = await this._concernRepo.findWithPagination(query, limit, skip, sort);
  if (!concerns) throwError("Failed to fetch concerns");

  const courses = await this.baseCourseRepo.findAll();
  return { concerns, courses };
}

  async countAllConcerns(filters: {
  status?: 'open' | 'in-progress' | 'resolved';
  courseId?: string;
  search?: string;
}): Promise<number> {
  const query: FilterQuery<IConcern> = {};

  if (filters.status) query.status = filters.status;
  if (filters.courseId) query.courseId = filters.courseId;

  if (filters.search && filters.search.trim()) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { message: { $regex: filters.search, $options: "i" } }
    ];
  }

  return this._concernRepo.count(query);
}
}

export default AdminCourseServices;