import mongoose, { Document, ObjectId, Types } from "mongoose";
import { Request } from "express";
type UserRole="user"|"mentor"
export interface IUser extends Document {
  _id:string
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

export interface IDcoded{
  role: string,
  userId: string
  iat: number,
  exp:number
}
export interface AuthenticatedRequest extends Request {
    user?: { id: string };  
}
