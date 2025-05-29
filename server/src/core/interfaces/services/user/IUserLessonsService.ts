import { ObjectId } from "mongoose";
import { ILesson, IQuestions } from "../../../../types/lessons";

export interface IUserLessonsService {
    getLessons(courseId: string|ObjectId, userId: string): Promise<ILesson[]>
    getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]>
    getLessonDetils(lessonId:string|ObjectId):Promise<{questions:IQuestions[],videoUrl:string,lesson:ILesson}>
}