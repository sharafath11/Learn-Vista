import { Document, Types, Model } from 'mongoose';

// Base interface without Document methods
export interface IMentorBase {
  userId: Types.ObjectId;
  profilePicture?: string;
  email: string;
  password?: string;
  username: string;
  experience?: number;
  expertise?: string[];
  status?: 'pending' | 'active' | 'inactive' | 'banned' | 'rejected';
  bio?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  liveClasses?: Types.ObjectId[];
  coursesCreated?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
  applicationDate?: Date;
  isVerified?: boolean;
  cvOrResume?: string;
  cvPublicId?: string;
  cvSize?: number;
}

// Document interface that includes Mongoose document methods
export interface IMentor extends IMentorBase, Document {}

export interface IMentorModel extends Model<IMentor> {}