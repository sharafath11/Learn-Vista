// models/UserCourseProgress.ts

import mongoose, { Schema } from 'mongoose';
import { IUserCourseProgress } from '../../types/userCourseProgress';

const UserCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    totalLessons: { type: Number, required: true },
    overallProgressPercent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const UserCourseProgressModel = mongoose.model<IUserCourseProgress>('UserCourseProgress', UserCourseProgressSchema);
export default UserCourseProgressModel;
