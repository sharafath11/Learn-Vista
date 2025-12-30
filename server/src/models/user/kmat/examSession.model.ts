import mongoose, { Schema, Document } from 'mongoose';

export interface IKMATExamSession extends Document {
  userId: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
  startedAt: Date;
  submittedAt?: Date;
  status: 'in_progress' | 'submitted';
}

const KMATExamSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'KMATQuestion', required: true }],
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  status: {
    type: String,
    enum: ['in_progress', 'submitted'],
    default: 'in_progress'
  }
}, { timestamps: true });

export const KMATExamSession = mongoose.model<IKMATExamSession>('KMATExamSession', KMATExamSessionSchema);
