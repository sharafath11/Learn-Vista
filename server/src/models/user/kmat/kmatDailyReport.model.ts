import mongoose, { Schema, Document } from 'mongoose';

export interface IKmatDailyReport extends Document {
  userId: mongoose.Types.ObjectId;
  dayNumber: number;
  date: string;
  strengths: string[];
  weaknesses: string[];
  negativeMarkingImpact: string;
  nextSteps: string[];
}

const KmatDailyReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayNumber: { type: Number, required: true },
  date: { type: String, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  negativeMarkingImpact: { type: String },
  nextSteps: [{ type: String }],
}, { timestamps: true });

export const KmatDailyReport = mongoose.model<IKmatDailyReport>('KmatDailyReport', KmatDailyReportSchema);
