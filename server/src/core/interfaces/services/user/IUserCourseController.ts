import { IPopulatedCourse } from "../../../../types/classTypes";

export interface IUserCourseService {
    getAllCourses: () => Promise<IPopulatedCourse[]>
    updateUserCourse:(courseId:string,userId:string)=>Promise<void>
}