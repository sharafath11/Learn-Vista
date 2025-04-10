import { Document, Types, Model } from 'mongoose';

// Base interface without Document methods
export interface IMentorBase {
  _id: string
  userId: Types.ObjectId;
  profilePicture?: string;
  email: string;
  password?: string;
  username: string;
  experience?: number;
  expertise?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  bio?: string;
  socialLinks?:SocialLink[],
  liveClasses?: Types.ObjectId[];
  coursesCreated?: Types.ObjectId[];
  isBlock:boolean,
  reviews?: Types.ObjectId[];
  applicationDate?: Date;
  isVerified?: boolean;
  cvOrResume?: string;
  cvPublicId?: string;
  cvSize?: number;
 
}
export interface SocialLink {
  platform: "twitter" | "github" | "website";
  url: string;
}
export interface IMentor extends IMentorBase, Document {
  phoneNumber: string;
  googleMentor: boolean;
  googleId: string;
  role:"mentor"
  
}

export interface IMentorModel extends Model<IMentor> {}