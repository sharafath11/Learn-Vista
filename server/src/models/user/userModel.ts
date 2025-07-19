import mongoose, { Schema,  Model, Types } from "mongoose";
import { IUser } from "../../types/userTypes";

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },
    role: { type: String, required: true },
    googleUser: { type: Boolean, default: false },
    googleId: { type: String, default: "" },
    profilePicture: { type: String, default: null },
    isBlocked: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, default: false },

    enrolledCourses: [{
      courseId: { type: Types.ObjectId, ref: "Course" },
      allowed: { type: Boolean, default: true },
    }],
  },
  { timestamps: true }
);


export const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
