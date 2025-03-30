import mongoose, { Document, Types } from "mongoose";

type UserRole="user"|"mentor"
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked?: boolean;
  isVerified: false;
  createdAt?: Date;
  updatedAt?: Date;
  enrolledCourses?: Types.ObjectId[];
}
export interface LoginUser{
  email: string,
  password:string
}
export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
