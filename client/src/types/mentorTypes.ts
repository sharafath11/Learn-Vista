
import { IConcern } from "./concernTypes";
import { ICourse, IPopulatedCourse } from "./courseTypes";
import { INotification } from "./notificationsTypes";


export type MentorStatus = 'pending' | 'approved' | 'rejected';

export interface SocialLink {
  platform: "twitter" | "github" | "website" | "linkedin";
  url: string;
}

export interface IMentor {
  id: string;
  students?:number
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
  coursesCreated?: ICourse[];
  liveClasses: any[];
  reviews: any[];
  isBlock: boolean;
  isVerified: boolean;
  status: MentorStatus;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MentorApplyFormData {
  username: string;
  email: string;
  phoneNumber: string;
  expertise: string[];
  socialLinks: SocialLink[];
}

export interface MentorApplyFormErrors {
  name: string;
  email: string;
  phoneNumber: string;
  file: string;
  socialLink: string;
}

export interface IMentorContext {
  mentor: IMentor | null;
  setMentor: React.Dispatch<React.SetStateAction<IMentor | null>>;
  refreshMentor: () => void;
  courses: IPopulatedCourse[];
  setCourses: React.Dispatch<React.SetStateAction<IPopulatedCourse[]>>;
  concerns: IConcern[]
  setConcerns: React.Dispatch<React.SetStateAction<IConcern[]>>;
  mentorNotification: INotification[];
  setMentorNotifications: React.Dispatch<React.SetStateAction<INotification[]>>; 
  mentorUnreadNotification: number;
  setMentorUnreadNotification: React.Dispatch<React.SetStateAction<number>>;
  refreshMentorNotification:()=>void
}

export interface IMentorSignupData {
  email: string;
  password: string;
  confirmPassword: string;
  experience: number;
  bio: string;
  isVerified: boolean;
  otp: string;
  phoneNumber: string;
  socialLinks?: SocialLink[]
}
export interface MentorSignupOtpProps {
  label: string;
  email: string;
  onChange: (e: { target: { id: string; value: string } }) => void;
  onVerified: () => void;
  onResend?: () => void;
}
export interface IMentorSingupFormInputProps {
  label: string;
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
};
type SortDirection = 1 | -1
type StudentStatus = "allowed" | "blocked"
interface StudentFilters {
  status?: StudentStatus
}
interface StudentSort {
  createdAt?: SortDirection
}
export interface IGetCourseStudentsParams {
  courseId: string
  page?: number
  limit?: number
  search?: string
  filters?: StudentFilters
  sort?: StudentSort
}
type SortOrder = 1 | -1;


export interface MentorFilters {
  status?: MentorStatus;
}

type MentorSort = Partial<Record<"username" | "createdAt" | "updatedAt", SortOrder>>;
