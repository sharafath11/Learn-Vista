
import {  Mentor } from "./adminTypes"
export type MentorSignupData = Partial<IMentorMentor> & {
  password?: string,
  phoneNumber: number,
  confirmPassword: string,
  otp:string
}
export interface IMentorContext{
  mentor: IMentorMentor|null;
  setMentor: React.Dispatch<React.SetStateAction<IMentorMentor | null>>;
  
}
export interface IMentorMentor {
  _id: string;
  userId: string;
  username: string;
  email: string;
  profilePicture: string | null;
  bio: string | null;
  experience: number;
  expertise: string[];
  socialLinks: string[];
  cvOrResume: string;
  coursesCreated: any[]; // You can replace `any` with a specific Course type if available
  liveClasses: any[];    // Replace `any` with a specific Class type if defined
  reviews: any[];        // Replace `any` with a Review type if available
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected'; // assuming these are the possible statuses
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
