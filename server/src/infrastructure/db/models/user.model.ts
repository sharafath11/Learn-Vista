// src/infrastructure/db/models/user.model.ts
import bcrypt from "bcryptjs"
import mongoose, { Schema, Model, Types } from "mongoose";
import { IUser, UserModel } from "../../../core/entities/user.entity";

const userSchema = new Schema<IUser, UserModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },
    role: { type: String, required: true },
    googleUser: { type: Boolean, default: false },
    googleId: { type: String, default: null, unique: true, sparse: true },
    profilePicture: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    enrolledCourses: [{ type: Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);


userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const userModel: UserModel = mongoose.model<IUser, UserModel>("User", userSchema);