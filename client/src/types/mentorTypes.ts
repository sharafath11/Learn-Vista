
import {  ICourse, Mentor } from "./adminTypes"
export interface MentorSignupData {
  email: string;
  password: string;
  confirmPassword: string;
  experience: number;
  bio: string;
  isVerified: boolean;
  otp: string;
  phoneNumber: string;
}
export interface IMentorContext{
  mentor: IMentorMentor|null;
  setMentor: React.Dispatch<React.SetStateAction<IMentorMentor | null>>;
  refreshMentor: () => void
  courses:ICourse[],
  setCourses:React.Dispatch<React.SetStateAction<ICourse[]>>;
  
}
export interface SocialLink {
  platform: "twitter" | "github" | "website";
  url: string;
}
export interface IMentorMentor {
  _id: string;
  id:string
  userId: string;
  username: string;
  email: string;
  profilePicture: string | null;
  bio: string | null;
  experience: number;
  courses?:ICourse[]
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
export interface FormOTPProps {
  label: string
  email: string
  onChange: (e: { target: { id: string; value: string } }) => void
  onVerified: () => void
  onResend?: () => void
}
export interface ClassSession {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  students: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  topic: string;
  description?: string;
}