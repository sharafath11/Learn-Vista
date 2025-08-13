
import mongoose, { Document } from "mongoose";
export interface IUserLessonProgress extends Document {
  _id:mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  videoProgressPercent: number;
  videoWatchedDuration: number; 
  videoTotalDuration: number; 
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  overallProgressPercent: number;
  videoCompleted:boolean
}