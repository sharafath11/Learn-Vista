
import {  Mentor } from "./adminTypes"
export type MentorSignupData = Partial<IMentorMentor> & {
  password?: string,
  phoneNumber: string,
  confirmPassword: string,
  otp:string
}
export interface IMentorContext{
  mentor: IMentorMentor|null;
  setMentor: React.Dispatch<React.SetStateAction<IMentorMentor | null>>;
  refreshMentor:()=>void
  
}
export interface SocialLink {
  platform: "twitter" | "github" | "website";
  url: string;
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
  socialLinks: SocialLink[];
  cvOrResume: string;
  phoneNumber:""
  coursesCreated: any[]; 
  liveClasses: any[];    
  reviews: any[];       
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type FormInputProps = {
  label: string;
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
};