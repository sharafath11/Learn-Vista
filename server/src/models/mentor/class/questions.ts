import mongoose, { Schema } from 'mongoose';
import { IQuestions } from '../../../types/lessons';

const LessonQuestionsSchema = new Schema<IQuestions>({
  lessonId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['theory', 'practical', 'mcq'],
  },
  question: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  options: [String], 
  correctAnswer: Schema.Types.Mixed, 
});

const questionModel =
  mongoose.models.Questions ||
  mongoose.model<IQuestions>('Questions', LessonQuestionsSchema);

export default questionModel;
