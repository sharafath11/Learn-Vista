// src/types/lessons.ts
import { Types } from "aws-sdk/clients/acm";
import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface ILesson extends Document {
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


export interface IQuestions extends Document {
  
  lessonId: string;
  question: string;
  type:"theory"|"practical"
  isCompleted: boolean;
}
export interface LessonQuestionEvaluation {
  question: string;
  type: 'theory' | 'practical';
  studentAnswer: string;
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
  lessonId: ObjectId | string;
  userId?: ObjectId | string;
  userName: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
