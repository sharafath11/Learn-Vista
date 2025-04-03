import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "../../types/userTypes";


const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isBlocked: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, default: false },
    enrolledCourses: [{ type: Types.ObjectId, ref: "Course" }], 
  },
  { timestamps: true }
);

export const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
