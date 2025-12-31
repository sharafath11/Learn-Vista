import mongoose, { Schema, Document } from 'mongoose';

export interface IKmatExamAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  dayNumber: number;
  date: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  negativeMarks: number;
  finalScore: number;
  sectionWiseScore: {
    section: string;
    score: number;
    correct: number;
    wrong: number;
  }[];
}

const KmatExamAttemptSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayNumber: { type: Number, required: true },
  date: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  attempted: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  unattempted: { type: Number, required: true },
  negativeMarks: { type: Number, required: true },
  finalScore: { type: Number, required: true },
  sectionWiseScore: [{
    section: String,
    score: Number,
    correct: Number,
    wrong: Number
  }],
}, { timestamps: true });

export const KmatExamAttempt = mongoose.model<IKmatExamAttempt>('KmatExamAttempt', KmatExamAttemptSchema);
