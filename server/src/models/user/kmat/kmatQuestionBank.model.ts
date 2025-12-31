import mongoose, { Schema, Document } from 'mongoose';

export interface IKmatQuestionBank extends Document {
  section: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const KmatQuestionBankSchema: Schema = new Schema({
  section: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
}, { timestamps: true });

export const KmatQuestionBank = mongoose.model<IKmatQuestionBank>('KmatQuestionBank', KmatQuestionBankSchema);
