import mongoose, { Schema, Document, ObjectId, Decimal128 } from 'mongoose';
import { ISession } from '../../types/classTypes';


const SessionSchema: Schema = new Schema(
  {
    title: { type: String, default: null },
    duration: { type: Schema.Types.Decimal128, default: null },
    content: { type: String, default: null },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    videoUrl: { type: String, default: null },
    liveSessionId: { type: Schema.Types.ObjectId, ref: 'LiveClass', default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Session = mongoose.model<ISession>('Session', SessionSchema);
export default Session;
