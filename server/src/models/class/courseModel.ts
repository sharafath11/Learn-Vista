import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ICourse } from '../../types/classTypes';


const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    thumbnail: { type: String },
    price: { type: Number, default: 0 },
    language: { type: String },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

//search cheyyan index cheyth vekkka
CourseSchema.index({ title: 'text', tags: 'text' });

const CourseModal = mongoose.model<ICourse>('Course', CourseSchema);
export default CourseModal;
