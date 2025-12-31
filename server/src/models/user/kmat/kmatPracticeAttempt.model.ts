import mongoose, { Schema, Document } from 'mongoose';

export interface IKmatPracticeAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  dayNumber: number;
  questionId: mongoose.Types.ObjectId;
  isCorrect: boolean;
  attemptedAt: Date;
}

const KmatPracticeAttemptSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayNumber: { type: Number, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'KmatQuestionBank', required: true },
  isCorrect: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const KmatPracticeAttempt = mongoose.model<IKmatPracticeAttempt>('KmatPracticeAttempt', KmatPracticeAttemptSchema);
