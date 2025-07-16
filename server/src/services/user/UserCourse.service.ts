import { inject, injectable } from "inversify";
import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ICategory, ICourse, IPopulatedCourse } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IUserCourseProgress } from "../../types/userCourseProgress";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";


@injectable()
export class UserCourseService implements IUserCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private _baseCourseRepo: ICourseRepository,
    @inject(TYPES.UserRepository) private _baseUserRepo: IUserRepository,
    @inject(TYPES.CategoriesRepository) private _categoriesRepo: ICategoriesRepository,
    @inject(TYPES.UserCourseProgressRepository) private _userCourseProgressRepo: IUserCourseProgressRepository,
    @inject(TYPES.UserLessonProgressRepository) private _userLessonProgressRepo: IUserLessonProgressRepository,
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository
  ) {}

  async getAllCourses(
      page: number = 1,
      limit: number = 1,
      search?: string,
      filters: FilterQuery<IPopulatedCourse> = {},
      sort: Record<string, 1 | -1> = { createdAt: -1 },
      userId?:string|ObjectId
  ):Promise<{ data: IPopulatedCourse[]; total: number; totalPages?: number }> {
     console.log("filter (received param):", filters,"sort (received param):", sort)

    const queryParams = {
          page,
          limit,
          search,
          filters,
          sort: sort
        };

     console.log("queryParams for repo:", queryParams)

    const { data, total, totalPages } = await this._baseCourseRepo.fetchAllCoursesWithFilters(
         queryParams
    );
        if (!data) throwError("Failed to fetch Courses", StatusCode.INTERNAL_SERVER_ERROR);
        return { data, total, totalPages };
  }

  async updateUserCourse(courseId: string, userId: string): Promise<void> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await this._baseCourseRepo.findById(courseId);
    if (!course) {
      throwError("Course not found.", StatusCode.BAD_REQUEST);
    }
   const res= await this._baseCourseRepo.update(courseId, {
      $addToSet: { enrolledUsers: userObjectId }
    });
  console.log("cc",courseObjectId)
  await this._baseUserRepo.update(userId, {
  $addToSet: {
    enrolledCourses: {
      courseId: courseObjectId,
      allowed: true
    }
  }
});

  }
  async getCategries(): Promise<ICategory[]> {
    const result = await this._categoriesRepo.findAll();
    return result
  }
  async getProgress(userId: string): Promise<IUserCourseProgress[]> {
    const result = await this._userCourseProgressRepo.findAll({ userId: userId });
    if (!result) throwError("Somthing wrent wrong")
    return result
  }


}