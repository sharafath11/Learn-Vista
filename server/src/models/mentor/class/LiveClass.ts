import mongoose, { Schema } from 'mongoose';
import { ILiveClass } from '../../../types/classTypes';

const LiveClassSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    date: { type: Date, required: true },
    duration: { type: String},
    liveId: { type: String, required: true, unique: true },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
      }
    ],
    isActive: { type: Boolean, default: false },
    isEnd:{type:Boolean,default:false}
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const LiveClassModel = mongoose.model<ILiveClass>('LiveClass', LiveClassSchema);
export default LiveClassModel;
