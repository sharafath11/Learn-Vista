import mongoose, { Schema, ObjectId } from 'mongoose';
import { ISession } from '../../types/classTypes';

const SessionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    videoUrl: { type: String, default: null },
    liveSessionId: { type: Schema.Types.ObjectId, ref: 'LiveClass', default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const SessionModel = mongoose.model<ISession>('Session', SessionSchema);
export default SessionModel;
