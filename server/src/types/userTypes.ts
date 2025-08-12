import  { Document, Types } from "mongoose";
import { Request } from "express";

type UserRole = "user" | "mentor"
export interface IEnrolledCourse {
  courseId: Types.ObjectId;
  allowed: boolean;
}
export interface IMentorStudentEnroledCourse {
  courseId: string;
  allowed:boolean
}
export interface userEnrolled extends IMentorStudentEnroledCourse{}
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  enrolledCourses: IEnrolledCourse[];
  createdAt?: Date;
  updatedAt?: Date;
  googleUser: boolean
  googleId:string
}
export interface ISafeUser {
  id:string
  username: string;
  email: string;
  role: UserRole;
  profilePicture?: string | null;
  isBlocked: boolean;
  // isVerified: boolean;
  enrolledCourses: Types.ObjectId[]; 
  createdAt?: Date;
  updatedAt?: Date;
  
}
export interface LoginUser{
  email: string,
  password:string
}
export interface IOtp extends Document {
  // status: string;
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


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role?: string;
    mentorId?: string;
  };
}
export interface GooglePayload {
  googleUser: boolean;
  googleId: string;
  username: string;
  email: string;
  image: string;
  role: string;
}