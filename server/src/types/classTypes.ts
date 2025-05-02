
import { Document, ObjectId } from "mongoose";

export interface ISessionDocument extends ISession, Document {
  _id: ObjectId; 
}

export interface ISession extends Document {
  _id: ObjectId;
  title: string;
  duration: number;
  content?: string;
  courseId: ObjectId;
  videoUrl: string;
  order?: number;
  isPreview?: boolean;
  resources?: string[];
  createdAt: Date;
  updatedAt: Date;
  liveSessionId?: ObjectId;
  practicalId?: ObjectId;
}

export interface ICourse extends Document {
    _id: ObjectId;
    title: string;
    description?: string;
    mentorId: ObjectId;
    sessions: ObjectId[];
    categoryId: ObjectId;
    thumbnail?: string;
    price?: number;
    language?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  export interface ICategory extends Document {
    title: string;
    description: string;
    isBlock:boolean,
    createdAt?: Date;
    updatedAt?: Date;
  }