import mongoose, { Document, ObjectId, Types } from "mongoose";
import { Request } from "express";
type UserRole="user"|"mentor"
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  enrolledCourses: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
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
