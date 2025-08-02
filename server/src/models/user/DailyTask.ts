import { Schema, model, Model } from 'mongoose';
import { IDailyTask, ISubTask } from "../../types/dailyTaskType";

const SubTaskSchema = new Schema<ISubTask>(
  {
    type: {
      type: String,
      enum: ["listening", "speaking", "writing"],
      required: true,
    },
    prompt: { type: String, required: true },
    userResponse: { type: String, default: null },
    isCompleted: { type: Boolean, default: false },
    aiFeedback: { type: String },
    score: { type: Number },
  },
  { _id: false } 
);

const DailyTaskSchema = new Schema<IDailyTask>(
  {
    userId: {
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    tasks: { type: [SubTaskSchema], default: [] },
    overallScore: { type: Number },
  },
  { timestamps: true }
);

export const DailyTaskModel: Model<IDailyTask> = model<IDailyTask>("DailyTask", DailyTaskSchema);