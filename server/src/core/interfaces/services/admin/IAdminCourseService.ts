// types/services/IAdminCourseServices.ts

import { ObjectId } from "mongoose";
import { ICourse } from "../../../../types/classTypes";

import { ICourseAdminResponse } from "../../../../shared/dtos/courses/course-response.dto";
import { IAdminLessonResponseDto} from "../../../../shared/dtos/lessons/lessonResponse.dto";
import { IAdminCommentResponseDto } from "../../../../shared/dtos/comment/commentResponse.dto";
import { IQuestionAdminResponseDto } from "../../../../shared/dtos/question/question-response.dto";

export interface IAdminCourseServices {
  createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourseAdminResponse>;
  blockCourse(id: string, status: boolean): void;
  getClass(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICourseAdminResponse[]; total: number; totalPages?: number }>;
  editCourseService(courseId: string, data: ICourse, thumbnail?: Buffer): Promise<ICourseAdminResponse>;
  getLessons(courseId:string|ObjectId):Promise<{
    lessons: IAdminLessonResponseDto[];
    comments: IAdminCommentResponseDto[];
    questions: IQuestionAdminResponseDto[];
  }>
}
