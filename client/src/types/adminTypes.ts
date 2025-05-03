
import React from "react";
import { IUser, UserRole } from "./authTypes"; 
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export type dropDown = 'All' | 'admin' | 'mentor' | 'user';


export interface AdminUser extends IUser {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
}

export interface UserTableProps {
  currentUsers: IUser[];
  getRoleColor: (role: string) => string; 
  onBlockToggle?: (userId: string, newStatus: boolean) => void;
}
export interface userBlock{
  id: string,
  status:boolean
}


export type UserStatus = 'All' | 'Active' | 'Blocked';

export interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: UserStatus;
  setStatusFilter: (value: UserStatus) => void;
}






export type { UserRole };
  
  
  
  
  
  
///mentorTypes
  
export type MentorStatus = 'Approved' | 'Pending' | 'Rejected';

export interface IMentor {
  id: number;
  name: string;
  expertise: string;
  status: MentorStatus;
  students: number;
  courses: number;
  avatar?: string;
}

export interface MentorTableProps {
  mentors: IMentor[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export interface MentorDetailsProps {
  mentor: IMentor;
  onClose: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// types.ts
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}
export interface SocialLink {
  platform: "twitter" | "github" | "website";
  url: string;
}
export interface Mentor {
  id: string;
  userId: string;
  username: string;
  email: string;
  profilePicture: string | null;
  bio: string | null;
  experience: number;
  expertise: string[];
  socialLinks: SocialLink[];
  cvOrResume: string;
  phoneNumber:string,
  coursesCreated: any[]; 
  liveClasses: any[];    
  reviews: any[];     
  isBlock:boolean
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected'; 
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminContextType {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  mentors: Mentor[];
  setMentors: React.Dispatch<React.SetStateAction<any[]>>;
  refreshMentors: () => void;
  users: AdminUser[]
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setCat: React.Dispatch<React.SetStateAction<ICategory[]>>;
  cat:ICategory[]
}
export interface ICourse  {
  _id:string;
  title: string;
  description?: string;
  mentorId: string;
  sessions: string[];
  categoryId: string;
  thumbnail?: string;
  price?: number;
  language?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface ICourseFormData {
  title: string
  description: string
  // mentorName: string
  category: string
  price: string
  language: string
  tags: string[]
  currentTag: string
  startDate: string
  endDate: string
  startTime: string
  thumbnailPreview: string | null
}
export interface ICategory {
  id: string;
  title: string;
  description: string;
  isBlock:boolean,
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICourse  {
  _id: string;
  title: string;
  description?: string;
  mentorId: string;
  sessions: string[];
  categoryId: string;
  category?: string; 
  price?: number;
  courseLanguage?: string;
  isBlock: boolean;
  tags?: string[];
  currentTag?: string;     
  startDate?: string;     
  endDate?: string;        
  startTime?: string;      
  thumbnail?: string;
  thumbnailPreview?: string | null; 
  createdAt: Date;
  updatedAt: Date;
}
export type CourseFormData = {
  title: string;
  description: string;
  mentorId: string;
  categoryId: string;
  category: string;
  price: string | number;
  language: string;
  tags: string;
  startDate: string;
  endDate: string;
  startTime: string;
  thumbnail?: File;
};