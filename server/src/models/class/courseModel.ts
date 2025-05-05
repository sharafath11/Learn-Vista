import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../../types/classTypes';

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    thumbnail: { type: String },
    students:{type:Number,default:0},
    price: { type: Number, default: 0 },
    // mentorApproved: { type: Boolean, default: false },
    mentorStatus: {
      type: String,
      enum: ['approved', 'rejected',"pending"],
      default: 'pending',
      required: true,
    },
    isCompleted:{type:Boolean,default:false},
    courseLanguage: { type: String },
    isBlock: { type: Boolean, required: true, default: false },
    tags: [{ type: String }],
    startDate: { type: String }, 
    endDate: { type: String },
    startTime: { type: String },   },
  { timestamps: true }
);

// Text search index
CourseSchema.index({ title: 'text', tags: 'text' });

const CourseModel = mongoose.model<ICourse>('Course', CourseSchema);
export default CourseModel;
