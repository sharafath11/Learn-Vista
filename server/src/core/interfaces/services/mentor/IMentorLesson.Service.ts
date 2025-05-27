import { ObjectId } from "mongoose";
import { ILesson } from "../../../../types/lessons";

export interface IMentorLessonService {
  getLessons(courseId: string | ObjectId): Promise<ILesson[]>;

  addLesson(data: Partial<ILesson>): Promise<ILesson>;

  editLesson(lessonId: string | ObjectId, updateLesson: Partial<ILesson>): Promise<ILesson>;

  deleteLesson?(lessonId: string | ObjectId): Promise<void>; 
}
