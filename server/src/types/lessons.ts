import mongoose from "mongoose";
import { Document } from "mongoose";

export interface ILesson extends Document {
    title: string;
    videoUrl: string;
    thumbnail?: string;  
    duration?: string;
    description?: string;
    courseId: mongoose.Types.ObjectId|string;
    order?: number;
    isFree: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  