import { ISocialLink } from "../../../types/mentorTypes";

export interface IMentorResponseDto {
  id: string;
  userId: string;
  profilePicture?: string | null;
  email: string;
  phoneNumber: string;
  username: string;
  experience: number;
  expertise: string[];
  googleMentor: boolean;
  courses?: string[];
  role: 'mentor';
  googleId?: string;
  status: 'pending' | 'approved' | 'rejected';
  isBlock: boolean;
  bio?: string;
  socialLinks: any[] | string;
  liveClasses: string[];
  coursesCreated: string[];
  reviews: string[];
  applicationDate: Date;
  isVerified: boolean;
  cvOrResume: string;
  createdAt: Date;
  
}
export interface IMentorMentorResponseDto {
  id: string;
  username: string;
  email: string;
  expertise: string[];
  experience: number;
  bio: string;
  applicationDate: Date;
  phoneNumber: string;
  profilePicture: string;
  socialLinks: ISocialLink[] |string
  liveClasses: string;
  coursesCreated: string;
  reviews: string;
}

export interface IAdminMentorResponseDto {
  id: string;
  username: string;
  coursesCreated:string
  expertise: string[];
  status: 'pending' | 'approved' | 'rejected';
    students: number;
    profilePicture: string;
    courses: number;
    liveClasses:string[];
    isBlock: boolean;
    cvOrResume: string
    email: string
    phoneNumber: string;
    socialLinks:string|ISocialLink[]
}
export interface IAdminAddCourseMentorsDto{
  id: string
  username: string
  isBlock: boolean
  expertise: string[]
  isVerified:boolean
}

