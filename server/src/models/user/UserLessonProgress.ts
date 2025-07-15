// models/UserLessonProgress.ts
import mongoose, { Schema } from "mongoose"
import { IUserLessonProgress } from "../../types/userLessonProgress"

const UserLessonProgressSchema: Schema = new Schema<IUserLessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    videoProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
    videoWatchedDuration: { type: Number, default: 0, min: 0 }, 
    videoTotalDuration: { type: Number, default: 0, min: 0 },
    theoryCompleted: { type: Boolean, default: false },
    practicalCompleted: { type: Boolean, default: false },
    mcqCompleted: { type: Boolean, default: false },
    overallProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
     videoCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const UserLessonProgressModel = mongoose.model<IUserLessonProgress>(
  "UserLessonProgress",
  UserLessonProgressSchema
);
