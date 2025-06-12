import { ObjectId } from "mongoose";
import { IComment, ILesson, IQuestions } from "../../../../types/lessons";

export interface IMentorLessonService {
  getLessons(courseId: string | ObjectId,mentorId:string|ObjectId): Promise<ILesson[]>;
  addLesson(data: Partial<ILesson>): Promise<ILesson>;
  editLesson(lessonId: string | ObjectId, updateLesson: Partial<ILesson>): Promise<ILesson>;
  deleteLesson?(lessonId: string | ObjectId): Promise<void>; 
  addQuestionService(lessonId: string | ObjectId, data: IQuestions): Promise<IQuestions>;
  editQuestionService(qustionId: string, data: Partial<IQuestions>): Promise<void>,
  getQuestionService(lessonId: string | ObjectId): Promise<IQuestions[]>
  getComments(lessonId: string | ObjectId): Promise<IComment[]>
  genrateOptions(question:string):Promise<string []>
}
