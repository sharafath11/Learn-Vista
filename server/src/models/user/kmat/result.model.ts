import mongoose, { Schema, Document } from 'mongoose';

export interface IKMATResult extends Document {
  examSessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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
  answers: {
    questionId: mongoose.Types.ObjectId;
    userAnswerIndex: number | null;
    isCorrect: boolean;
    marksAwarded: number;
  }[];
  weaknessAnalysis: string[];
  createdAt: Date;
}

const KMATResultSchema: Schema = new Schema({
  examSessionId: { type: Schema.Types.ObjectId, ref: 'KMATExamSession', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'KMATQuestion' },
    userAnswerIndex: { type: Number, default: null },
    isCorrect: { type: Boolean, required: true },
    marksAwarded: { type: Number, required: true }
  }],
  weaknessAnalysis: [String],
}, { timestamps: true });

export const KMATResult = mongoose.model<IKMATResult>('KMATResult', KMATResultSchema);
