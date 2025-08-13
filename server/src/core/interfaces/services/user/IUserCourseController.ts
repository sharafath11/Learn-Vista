

import { FilterQuery, ObjectId } from "mongoose";
import { ICategory, IPopulatedCourse } from "../../../../types/classTypes";
import { IUserCourseProgress } from "../../../../types/userCourseProgress";
import { ICourseUserResponseDto, IUserCourseProgressResponse } from "../../../../shared/dtos/courses/course-response.dto";
import { ICategoryUserCourseResponse } from "../../../../shared/dtos/categories/category-response.dto";

export interface IUserCourseService {
  getAllCourses(
    page: number,
    limit: number,
    search?: string,
    filters?: FilterQuery<IPopulatedCourse>,
      sort?: Record<string, 1 | -1>,
    userId?:string|ObjectId
  ): Promise<{ data: ICourseUserResponseDto[]; total: number; totalPages?: number }>;
  updateUserCourse(courseId: string, userId: string): Promise<void>;
  getCategries(): Promise<ICategoryUserCourseResponse[]>;
  getProgress(userId: string): Promise<IUserCourseProgressResponse[]>;
  validateUserEnrollment(userId: string | ObjectId, courseId: string | ObjectId): Promise<void>;
  updateUserCourseProgress(userId: string, courseId: string, lessonId?: string): Promise<void>;
}