import { Schema, model, Types, Document } from "mongoose";
import { IComment } from "../../../types/lessons";

const commentSchema = new Schema<IComment>(
  {
    lessonId: {
      type: Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: false,
    },
    courseId: {
      type: Types.ObjectId,
      ref: "course",
      required: true,
    },
    mentorId: {
      type: Types.ObjectId,
      ref: "mentor",
      required: false,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
