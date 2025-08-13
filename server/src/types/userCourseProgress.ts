import { Document,  Types } from 'mongoose';

export interface IUserCourseProgress extends Document {
  _id:string|Types.ObjectId
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  totalLessons: number;
  overallProgressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}