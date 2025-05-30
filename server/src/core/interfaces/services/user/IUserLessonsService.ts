import { ObjectId } from "mongoose";
import { IComment, ILesson, ILessonReport, IQuestions, LessonQuestionInput } from "../../../../types/lessons";

export interface IUserLessonsService {
    getLessons(courseId: string|ObjectId, userId: string): Promise<ILesson[]>
    getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]>
    getLessonDetils(lessonId:string|ObjectId,userId:string|ObjectId):Promise<{questions:IQuestions[],videoUrl:string,lesson:ILesson,comments:IComment[],report?:ILessonReport}>
    lessonReport(userId: string | ObjectId, lessonId: string, data: LessonQuestionInput): Promise<ILessonReport>
    saveComments(userId:string,lessonId:string|ObjectId,commant:string):Promise<IComment>
}
