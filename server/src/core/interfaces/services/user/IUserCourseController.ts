import { ICategory, ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IUserCourseProgress } from "../../../../types/userCourseProgress";

export interface IUserCourseService {
    getAllCourses: (page?: number,
        limit?: number,
        search?: string,
        filters?: Record<string, any>,
        sort?: Record<string, 1 | -1>) => Promise<{ data: IPopulatedCourse[]; total: number; totalPages?: number }>
    updateUserCourse: (courseId: string, userId: string) => Promise<void>,
    getCategries(): Promise<ICategory[]>
    getProgress(userId:string):Promise<IUserCourseProgress[]>
}