import mongoose, { Schema, Model, Document } from "mongoose";
import { ILesson } from "../../types/lessons";


const lessonSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: String },
  description: { type: String },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number },
  isFree: { type: Boolean, default: true }
}, {
  timestamps: true
});

const LessonModel: Model<ILesson> = mongoose.model<ILesson>("Lesson", lessonSchema);

export default LessonModel;
