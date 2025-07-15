import { ObjectId } from "mongoose";
import { IComment, ILesson, ILessonDetails, ILessonReport, IQuestions, LessonQuestionInput } from "../../../../types/lessons";
import { IUserLessonProgress } from "../../../../types/userLessonProgress";
export interface GetLessonsResponse {
  lessons: ILesson[];
  progress: IUserLessonProgress[];
}
export interface IUserLessonsService {
    getLessons(courseId: string|ObjectId, userId: string): Promise<GetLessonsResponse>
    getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]>
    getLessonDetils(lessonId:string|ObjectId,userId:string|ObjectId):Promise<ILessonDetails>
    lessonReport(userId: string | ObjectId, lessonId: string, data: LessonQuestionInput): Promise<ILessonReport>
    saveComments(userId:string,lessonId:string|ObjectId,commant:string):Promise<IComment>
}
