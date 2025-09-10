
import { IUser} from "./userTypes";
import { IMentor } from "./mentorTypes";
import { ICategory } from "./categoryTypes";
import { IPopulatedCourse } from "./courseTypes";
import { IConcern } from "./concernTypes";
import { INotification } from "./notificationsTypes";

export type DropDown = 'All' | 'admin' | 'mentor' | 'user';

export interface AdminUser extends IUser {
  isAdmin?: boolean;
}
export interface UserTableProps {
  currentUsers: IUser[];
  getRoleColor: (role: string) => string;
  onBlockToggle?: (userId: string, newStatus: boolean) => void;
}

export interface UserBlock {
  id: string;
  status: boolean;
}

export type SortOrder = 'asc' | 'desc';


export type RoleFilter =  'Mentor' | 'User'|'Course'|'Category'|'Concern';

export interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'All' | 'Active' | 'Blocked' | 'Approved' | 'Pending' | 'Rejected';
  setStatusFilter: (status: SearchAndFilterProps['statusFilter']) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
    roleFilter: RoleFilter;
 
}

export interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export interface MentorTableProps {
  mentors: IMentor[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export interface MentorDetailsProps {
  mentor: IMentor;
  onClose: () => void;
}
export interface AdminContextType {
  cMentors:IMentor[]
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  mentors: IMentor[];
  setMentors: React.Dispatch<React.SetStateAction<IMentor[]>>;
  refreshMentors: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: Record<string, any>;
  }) => void;
  users: AdminUser[];
  getCategories:(params?: {
    page?: number;
    search?: string;
    filters?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
  }) => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  cat: ICategory[];
  setCat: React.Dispatch<React.SetStateAction<ICategory[]>>;
  getAllUsers: (params?: {
    page?: number;
    search?: string;
    filters?: Record<string, unknown>;
    limit?:number
    sort?: Record<string, 1 | -1>;
  }) => Promise<void>;
  courses: IPopulatedCourse[];
  setCourses: React.Dispatch<React.SetStateAction<IPopulatedCourse[]>>;
  getCourse: () => Promise<void>;
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loadingUsers: boolean;
  totalUsersCount: number;
  mentorPagination: {
    page: number;
    limit: number;
    total: number;
  };
  avilbleMentors: IMentor[]
  categories: ICategory[]
  concern: IConcern[]
  setConcerns: React.Dispatch<React.SetStateAction<IConcern[]>>;
  allConcerns: IConcern[]
  setAllConcerns: React.Dispatch<React.SetStateAction<IConcern[]>>;
  adminNotifications: INotification[];
  setAdminNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  adminUnreadNotification: number;
  setAdminUnreadNotification: React.Dispatch<React.SetStateAction<number>>;
  refreshAdminNotification:()=>void

}
export interface FilterOptions {
  dateRange: {
    from: Date | null
    to: Date | null
  }
  amountRange: {
    min: number | null
    max: number | null
  }
  status: string
  sortBy: string
  sortOrder: "asc" | "desc"
  page: number
  limit: number
}
export interface CourseFormData {
  title: string;
  description: string;
  mentorId: string;
  categoryId: string;
  language: string;
  startDate: string;
  endDate: string;   
  startTime: string;
  thumbnail: File | string | null;
}
export interface IAdminUserFilters {
  role?: "student" | "mentor" | "admin";
  status?: "active" | "inactive";
  isBlocked?: boolean;
}
export type ICategoryFilters = {
  isBlock?: boolean;
};

export type ICategorySort = {
  createdAt?: 1 | -1;
};
export interface ICreateCourseForm {
  title?: string
  description?: string
  mentorId?: string
  categoryId?: string
  category: string
  price: number | string
  language: string
  tags: string
  startDate: string
  endDate: string
  startTime: string
  categoryName: string
  thumbnail?: File
}

 export interface IData{
        email: string,
        password:string
    }