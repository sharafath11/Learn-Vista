import mongoose, { Schema, Document } from 'mongoose';

export interface IUserKmatState extends Document {
  userId: mongoose.Types.ObjectId;
  currentDay: number;
  startedAt: Date;
  lastGeneratedDate: string;
  isActive: boolean;
}

const UserKmatStateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentDay: { type: Number, default: 1 },
  startedAt: { type: Date, default: Date.now },
  lastGeneratedDate: { type: String }, 
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const UserKmatState = mongoose.model<IUserKmatState>('UserKmatState', UserKmatStateSchema);
