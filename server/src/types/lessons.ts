// src/types/lessons.ts
import mongoose from "mongoose";
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