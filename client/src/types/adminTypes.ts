
import { IUser, UserRole } from "./authTypes"; 
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export type dropDown = 'All' | 'admin' | 'mentor' | 'user';


export interface AdminUser extends IUser {
  _id: string;
  name: string;
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

export interface Mentor {
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
  applicationDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface AdminContextType {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  mentors: any[];
}
