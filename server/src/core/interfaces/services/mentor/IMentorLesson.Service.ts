import { ObjectId } from "mongoose";
import {  ILesson, IQuestions } from "../../../../types/lessons";
import { IMentorLessonResponseDto } from "../../../../shared/dtos/lessons/lessonResponse.dto";
import { IMentorQustionsDto } from "../../../../shared/dtos/question/question-response.dto";
import { IMentorCommentResponseAtLesson } from "../../../../shared/dtos/comment/commentResponse.dto";

export interface IMentorLessonService {
  getLessons(courseId: string | ObjectId,mentorId:string|ObjectId): Promise<IMentorLessonResponseDto[]>;
  addLesson(data: Partial<ILesson>): Promise<IMentorLessonResponseDto>;
  editLesson(lessonId: string | ObjectId, updateLesson: Partial<ILesson>): Promise<IMentorLessonResponseDto>;
  deleteLesson?(lessonId: string | ObjectId): Promise<void>; 
  addQuestionService(lessonId: string | ObjectId, data: IQuestions): Promise<IMentorQustionsDto>;
  editQuestionService(qustionId: string, data: Partial<IQuestions>): Promise<void>,
  getQuestionService(lessonId: string | ObjectId): Promise<IMentorQustionsDto[]>
  getComments(lessonId: string | ObjectId): Promise<IMentorCommentResponseAtLesson[]>
  genrateOptions(question:string):Promise<string []>
}
