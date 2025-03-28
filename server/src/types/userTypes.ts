import mongoose, { Document, Types } from "mongoose";

type UserRole="user"|"mentor"
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  enrolledCourses?: Types.ObjectId[];
}
export interface LoginUser{
  email: string,
  password:string
}