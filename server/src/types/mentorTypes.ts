import { Document, Types } from 'mongoose';
import { ICourse } from './classTypes';

type SocialPlatform = 'LinkedIn' | 'GitHub' | 'Portfolio';

export interface ISocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface IMentor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  profilePicture?: string;
  email: string;
  password: string;
  phoneNumber: string;
  username: string;
  experience: number;
  expertise: string[];
  googleMentor?: boolean;
  courses?:ICourse[]
  role: 'mentor';
  googleId?: string;
  status: 'pending' | 'approved' | 'rejected';
  isBlock: boolean;
  bio?: string;
  socialLinks: ISocialLink[] |string;
  liveClasses: Types.ObjectId[];
  coursesCreated: Types.ObjectId[];
  reviews: Types.ObjectId[];
  applicationDate: Date;
  isVerified: boolean;
  cvOrResume: string;
  createdAt: Date;
  updatedAt: Date;
  courseRejectReson:IReson
}
export interface IReson {
  courseId: Types.ObjectId;
  message: string;
}

export type SafeMentor = Omit<IMentor, 'password'>;
export interface IMentorDTO {
  id: string;
  userId: string;
  profilePicture?: string;
  email: string;
  phoneNumber: string;
  username: string;
  experience: number;
  expertise: string[];
  googleMentor?: boolean;
  role: 'mentor';
  googleId?: string;
  status: 'pending' | 'approved' | 'rejected';
  isBlock: boolean;
  
  bio?: string;
  socialLinks: ISocialLink[];
  liveClasses: string[];
  coursesCreated: string[];
  reviews: string[];
  applicationDate: Date;
  isVerified: boolean;
  cvOrResume: string;
  createdAt: Date;
  updatedAt: Date;
}

// Utility types for different use cases
export type MentorCreateInput = Omit<IMentor, '_id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'status' | 'isBlock'>;
export type MentorUpdateInput = Partial<Omit<IMentor, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>;


export interface IMentorOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
