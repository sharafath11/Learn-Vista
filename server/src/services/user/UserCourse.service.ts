import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { IPopulatedCourse } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class UserCourseService implements IUserCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private _baseCourseRepo: ICourseRepository,
    @inject(TYPES.UserRepository) private _baseUserRepo: IUserRepository
  ) {}

  async getAllCourses(): Promise<IPopulatedCourse[]> {
    return await this._baseCourseRepo.populateWithAllFildes();
  }

  async updateUserCourse(courseId: string, userId: string): Promise<void> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await this._baseCourseRepo.findById(courseId);
    if (!course) {
      throwError("Course not found.", StatusCode.BAD_REQUEST);
    }
    await this._baseCourseRepo.update(courseId, {
      $addToSet: { enrolledUsers: userObjectId }
    });

    await this._baseUserRepo.update(userId, {
      $addToSet: { enrolledCourses: courseObjectId }
    });
  }
}
