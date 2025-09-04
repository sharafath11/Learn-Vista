import mongoose, { Schema,Model,Types } from "mongoose";
import { IVoiceNote } from "../../types/lessons";
const VoiceNoteSchema = new Schema<IVoiceNote>(
  {
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Types.ObjectId, ref: "Lesson", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    note: { type: String, required: true, trim: true },
    AiResponse:{type:String,}
  },
  { timestamps: true }
);

export const VoiceNoteModel: Model<IVoiceNote> = mongoose.model<IVoiceNote>("VoiceNote", VoiceNoteSchema);
