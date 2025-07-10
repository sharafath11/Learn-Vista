// models/LessonReport.ts

import { Schema, model, Types, Model } from 'mongoose';
import { ILessonReport } from '../../../types/lessons';

const LessonReportSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: Types.ObjectId, ref: 'Mentor', required: true },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: Types.ObjectId, ref: 'Lesson', required: true },
    report: { type: Schema.Types.Mixed, required: true },
    mentorResponse: { type: String }, 
  },
  {
    timestamps: true, 
  }
);

export const LessonReport: Model<ILessonReport> = model<ILessonReport>('LessonReport', LessonReportSchema);