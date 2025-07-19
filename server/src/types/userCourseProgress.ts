import { Document,  Types } from 'mongoose';

export interface IUserCourseProgress extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  totalLessons: number;
  overallProgressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}