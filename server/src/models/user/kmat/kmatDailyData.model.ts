import mongoose, { Schema, Document } from 'mongoose';

export interface IKmatDailyData extends Document {
  userId: mongoose.Types.ObjectId;
  dayNumber: number;
  date: string;
  learnContent: any[];
  practiceSet: any[];
  mockExamMeta: any;
  status: 'generated' | 'failed' | 'completed';
}

const KmatDailyDataSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayNumber: { type: Number, required: true },
  date: { type: String, required: true },
  learnContent: [{ type: Schema.Types.Mixed }],
  practiceSet: [{ type: Schema.Types.Mixed }],
  mockExamMeta: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['generated', 'failed', 'completed'], default: 'generated' }
}, { timestamps: true });

KmatDailyDataSchema.index({ userId: 1, date: 1 }, { unique: true });

export const KmatDailyData = mongoose.model<IKmatDailyData>('KmatDailyData', KmatDailyDataSchema);
