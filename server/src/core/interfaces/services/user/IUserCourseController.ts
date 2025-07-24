

import { FilterQuery, ObjectId } from "mongoose";
import { ICategory, IPopulatedCourse } from "../../../../types/classTypes";
import { IUserCourseProgress } from "../../../../types/userCourseProgress";

export interface IUserCourseService {
  getAllCourses(
    page: number,
    limit: number,
    search?: string,
    filters?: FilterQuery<IPopulatedCourse>,
      sort?: Record<string, 1 | -1>,
    userId?:string|ObjectId
  ): Promise<{ data: IPopulatedCourse[]; total: number; totalPages?: number }>;
  updateUserCourse(courseId: string, userId: string): Promise<void>;
  getCategries(): Promise<ICategory[]>;
  getProgress(userId: string): Promise<IUserCourseProgress[]>;
  // New methods for delegation
  validateUserEnrollment(userId: string | ObjectId, courseId: string | ObjectId): Promise<void>;
  updateUserCourseProgress(userId: string, courseId: string, lessonId?: string): Promise<void>;
}