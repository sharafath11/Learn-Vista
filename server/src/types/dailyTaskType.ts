import { Schema, model, Types, Document, Model } from 'mongoose';

export type TaskType = "listening" | "speaking" | "writing";

export interface ISubTask {
  type: TaskType;
  prompt: string;
  userResponse?: string | null;
  isCompleted: boolean;
  aiFeedback?: string;
  score?: number;
}

export interface IDailyTask extends Document {
  userId: Types.ObjectId;
  date: string;
  tasks: ISubTask[];
  overallScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}