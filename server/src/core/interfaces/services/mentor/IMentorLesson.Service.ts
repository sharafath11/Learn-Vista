import { ObjectId } from "mongoose";
import { ILesson } from "../../../../types/lessons";

export interface IMentorLessonService {
    getLessons(courseId: string | ObjectId): Promise<ILesson[]>
    // editLesson(lessonId: string | ObjectId, Lesson: ILesson): Promise<void>;
    // addLessons(courseId:string|ObjectId,data:ILesson):Promise<ILesson>
}