import mongoose, { Schema, Document } from 'mongoose';

export interface IKMATQuestion extends Document {
  section: 'Quantitative Ability' | 'Logical Reasoning' | 'Language Comprehension' | 'General Knowledge';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  createdAt: Date;
}

const KMATQuestionSchema: Schema = new Schema({
  section: {
    type: String,
    required: true,
    enum: ['Quantitative Ability', 'Logical Reasoning', 'Language Comprehension', 'General Knowledge']
  },
  topic: { type: String, required: true },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
}, { timestamps: true });

export const KMATQuestion = mongoose.model<IKMATQuestion>('KMATQuestion', KMATQuestionSchema);
