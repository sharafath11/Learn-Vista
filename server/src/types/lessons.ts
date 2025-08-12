import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";
import { IUserLessonProgress } from "./userLessonProgress";
import { IMentorCommentResponseDto } from "../shared/dtos/comment/commentResponse.dto";

export interface ILesson extends Document {
    _id:string | ObjectId
    title: string;
    videoUrl: string; 
     thumbnail?: string | Buffer;
    duration?: string;
    description?: string;
    courseId: mongoose.Types.ObjectId | string;
    order?: number;
    isFree: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ILessonUpdateData extends Partial<ILesson> {
    thumbnailFileBuffer?: Buffer; 
    clearThumbnail?: boolean; 
}


export interface ILessonCreationData extends Partial<ILesson> {
    thumbnailFileBuffer?: Buffer;
}




export type QuestionType = 'theory' | 'practical' | 'mcq';

export interface IQuestions extends Document {
  _id:string|ObjectId
  lessonId: string;
  question: string;
  type: QuestionType;
  isCompleted: boolean;
  options?: string[]; 
  correctAnswer?: string | string[]; 
  createdAt?: Date
  
}

export interface LessonQuestionEvaluation {
  question: string;
  type: QuestionType;
  studentAnswer: string | string[];
  isCorrect: boolean;
  feedback: string;
  marks: number;
}

export interface ILessonReport extends Document{
  userId: ObjectId|string;
  mentorId:ObjectId|string;
  courseId:ObjectId|string;
  lessonId:ObjectId|string;
  report: LessonQuestionEvaluation |string;
  mentorResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type LessonQuestionInput = {
  question: string;
  type: 'theory' | 'practical';
  studentAnswer: string;
};
export interface IComment extends Document {
  _id:string|ObjectId
  lessonId: ObjectId | string;
  userId?: ObjectId | string;
  userName: string;
  comment: string;
  mentorId:string|ObjectId
  courseId:ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGetAllCommentsResponse {
  comments: IMentorCommentResponseDto[];
  pagination: PaginationMeta;
}
export interface ILessonDetails {
  lesson: ILesson;
  videoUrl: string;
  lessonProgress: IUserLessonProgress | null;
  report?: ILessonReport| null;
  questions: IQuestions[];
  comments: IComment[];
}
