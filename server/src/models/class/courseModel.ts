import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../../types/classTypes';

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName:{type:String,required:true},
    thumbnail: { type: String },
    students:{type:Number,default:0},
    price: { type: Number, default: 0 },
    enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mentorStatus: {
      type: String,
      enum: ['approved', 'rejected',"pending"],
      default: 'approved',
      required: true,
    },
    isStreaming:{type:Boolean,default:false},
    lessons:[{ type: Schema.Types.ObjectId, ref: 'Lessons' }],
    isCompleted:{type:Boolean,default:false},
    courseLanguage: { type: String },
    isBlock: { type: Boolean, required: true, default: false },
    tags: [{ type: String }],
    startDate: { type: String }, 
    endDate: { type: String },
    startTime: { type: String },   },
  { timestamps: true }
);

CourseSchema.index({ title: 'text', tags: 'text' });

const CourseModel = mongoose.model<ICourse>('Course', CourseSchema);
export default CourseModel;
