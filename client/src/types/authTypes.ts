import React from "react";
import { IPopulatedCourse } from "./courseTypes";
import { ILessons } from "./lessons";
import { IUserCourseProgress, IUserLessonProgress } from "./userProgressTypes";
import { INotification } from "./notificationsTypes";
import { IDailyTask } from "./dailyTaskTypes";

export type UserRole = "user" | "mentor";

export interface IUserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  isVerified: boolean;
  otp?: string;
}

export interface ILogin {
  email: string;
  password: string;
  googleId: string,
  
}
interface IEnrolledCourse {
  courseId: string;
  allowed: boolean;
}
export interface IUser {
  id:string  
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  profilePicture?: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  enrolledCourses?: IEnrolledCourse[]; 
  createdAt?: string;
  updatedAt?: string;
}
export interface GetLessonsResponse {
  lessons: ILessons[];
  progress: IUserLessonProgress[];
}


export interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  allCourses: IPopulatedCourse[]
  fetchLessons: (courseId: string) => Promise<GetLessonsResponse>;
  curentUrl:string,
  setCurentUrl: React.Dispatch<React.SetStateAction<string>>
  setProgress: React.Dispatch<React.SetStateAction<IUserCourseProgress[]>>;
  progresses: IUserCourseProgress[]
  setUserNotifications:React.Dispatch<React.SetStateAction<INotification[]>>,
  userNotifications: INotification[],
  unreadCount: number,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>
  refereshNotifcation: () => void
  dailyTask:IDailyTask|null
  
}

export interface UserProviderProps {
  children: React.ReactNode;
}
export interface MentorApplyFormData {
  username: string;
  email: string;
  phoneNumber: string;
  expertise: string[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface MentorApplyFormErrors {
  name: string;
  email: string;
  phoneNumber: string;
  file: string;
  socialLink:string
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends IUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
export interface EditProfilePayload {
  username: string;
  image: File | null;
}

