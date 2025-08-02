// types/services/IAdminCourseServices.ts

import { ObjectId } from "mongoose";
import { ICourse } from "../../../../types/classTypes";
import { IComment, ILesson, IQuestions } from "../../../../types/lessons";

export interface IAdminCourseServices {
  createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourse>;
  blockCourse(id: string, status: boolean): void;
  getClass(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICourse[]; total: number; totalPages?: number }>;
  editCourseService(courseId: string, data: ICourse, thumbnail?: Buffer): Promise<ICourse>;
  getLessons(courseId:string|ObjectId):Promise<{
    lessons: ILesson[];
    comments: IComment[];
    questions: IQuestions[];
  }>
}
