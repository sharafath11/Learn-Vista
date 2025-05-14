import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ILiveClass } from '../../types/classTypes';



const LiveClassSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', default: null },
    title: { type: String, default: null },
    time: { type: String, default: null },
    date: { type: Date, default: null },
    duration: { type: String, default: null },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
      }
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const LiveClass = mongoose.model<ILiveClass>('LiveClass', LiveClassSchema);
export default LiveClass;
