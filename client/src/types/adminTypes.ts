import React from "react";

// Theme Enum
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

// Dropdown roles
export type DropDown = 'All' | 'admin' | 'mentor' | 'user';

// User Role Type (re-exported from elsewhere)
export type UserRole = 'admin' | 'mentor' | 'user';

// User Types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminUser extends IUser {}

export type UserStatus = 'All' | 'Active' | 'Blocked';

export interface UserTableProps {
  currentUsers: IUser[];
  getRoleColor: (role: string) => string;
  onBlockToggle?: (userId: string, newStatus: boolean) => void;
}

export interface UserBlock {
  id: string;
  status: boolean;
}

export interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: UserStatus;
  setStatusFilter: (value: UserStatus) => void;
}

// Sidebar Types
export interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Mentor Types
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
  phoneNumber: string;
  coursesCreated: any[];
  liveClasses: any[];
  reviews: any[];
  isBlock: boolean;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Social Media
export interface SocialLink {
  platform: "twitter" | "github" | "website";
  url: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// Course Types
export interface ICourse {
  id:string
  _id: string;
  title: string;
  description?: string;
  mentorId: string;
  mentorStatus: "approved" | "rejected" | "pending";
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

// For Course creation form
export interface ICourseFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  language: string;
  tags: string[];
  currentTag: string;
  startDate: string;
  endDate: string;
  startTime: string;
  thumbnailPreview: string | null;
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

// Categories
export interface ICategory {
  id: string;
  title: string;
  description: string;
  isBlock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Rejection Reason
export interface IReson {
  mentorId: string;
  message: string;
}

// Admin Context
export interface IPopulatedCourse extends ICourse {
  mentor?: Mentor;
  categoryDetails?: ICategory;
}

export interface AdminContextType {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  mentors: Mentor[];
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  refreshMentors: () => void;
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setCat: React.Dispatch<React.SetStateAction<ICategory[]>>;
  cat: ICategory[];
  courses: IPopulatedCourse[];
  setCourses: React.Dispatch<React.SetStateAction<IPopulatedCourse[]>>;
}
