
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
  category?: string; // for frontend display only
  price?: number;
  language?: string;
  isBlock: boolean;
  tags?: string[];
  currentTag?: string;     // frontend use
  startDate?: string;      // from form
  endDate?: string;        // from form
  startTime?: string;      // from form
  thumbnail?: string;
  thumbnailPreview?: string | null; // frontend use
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
 export interface ICourseFormData {
    title: string
    description: string
    mentorId: string
    categoryId: string
    category?: string
    price: string
    language: string
    tags: string[]
    currentTag: string
    startDate: string
    endDate: string
    startTime: string
    thumbnail?: File | null
    thumbnailPreview: string | null
  }
  