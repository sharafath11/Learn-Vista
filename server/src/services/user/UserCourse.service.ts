import { inject, injectable } from "inversify";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IPopulatedCourse } from "../../types/classTypes";

@injectable()
export class UserCourseService implements IUserCourseService {
    constructor(
        @inject(TYPES.CourseRepository) private _baseCourseRepo: ICourseRepository 
    ) {}

    async getAllCourses(): Promise<IPopulatedCourse[]> {
        const allCourses = await this._baseCourseRepo.populateWithAllFildes(); 
        return allCourses;
    }
    async updateUserCourse(courseId: string, userId: string): Promise<void> {
        await this._baseCourseRepo.update(courseId, {
            $addToSet: { enrolledUsers: userId } 
        });
    }
    
    
}
