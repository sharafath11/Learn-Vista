// src/core/entities/user.entity.ts
import { Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string | null;
  role: string;
  googleUser?: boolean;
  googleId?: string | null;
  profilePicture?: string | null;
  isBlocked?: boolean;
  isVerified?: boolean;
  enrolledCourses?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// If you need custom methods (like password comparison)
export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// The final UserModel type combining IUser + IUserMethods
export type UserModel = Model<IUser, {}, IUserMethods>;