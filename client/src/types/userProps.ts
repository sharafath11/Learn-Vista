import { ReactNode } from "react";
import { ICategory } from "./categoryTypes";
import { ICertificate } from "./certificateTypes";
import { ICourse, IcourseFromResponse, IPopulatedCourse } from "./courseTypes";
import { IDailyTask, ITask } from "./dailyTaskTypes";
import { IDonation } from "./donationTyps";
import { EvaluatedAnswer, IComment, ILessons, IQuestions, Level, SortOption } from "./lessons";
import { IUser, IUserRegistration } from "./userTypes";

export interface CertificateViewerProps {
  certificate: ICertificate
}
export interface ICertificateFilterValues {
  search: string
  sort: "latest" | "oldest"
  status: "all" | "revoked" | "valid"
}

export interface IFiltersProps {
  onChange: (filters: ICertificateFilterValues) => void
}
export interface IUserCourseCardProps {
  course: IcourseFromResponse
  index: number
  onDetailsClick: (course: IcourseFromResponse) => void
}

export interface IUserCourseDetailsModalProps {
  course: IcourseFromResponse
  isOpen: boolean
  onClose: () => void
  onEnroll: () => void
  isEnrolled?: boolean
}
export interface IUserCourseFilterProps {
  categories: ICategory[]
  onFilter: (filters: { search: string; category: string; sort: string }) => void
}
export interface IUserDailyProps {
  dailyTasks: IDailyTask[];
}
export interface ITaskesProps {
  task: ITask;
  taskId: string;
}
export interface IEmptyStateProps {
  filter: "active" | "expired"
  onExplore: () => void
}
export interface IUserSessionCardProps {
  session: IPopulatedCourse
  isExpired: boolean
  joiningSession: string | null
  onJoinCall: (courseId: string) => void
  onViewContent: (courseId: string) => void
}
export interface ISessionTableRowProps {
  session: IPopulatedCourse
  index: number
  isExpired: boolean
  joiningSession: string | null
  onJoinCall: (courseId: string) => void
  onViewContent: (courseId: string) => void
}
export interface IPaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export interface ISearchSortComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export interface ILessonContentProps {
  videoUrl: string;
  lessonTitle: string;
  lessonThumbnail: string;
  initialVideoStartTime: number;
  lessonDuration: number;
  questions: IQuestions[];
  videoCompleted: boolean;
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  onVideoComplete: () => void;
  onVideoProgress: (currentTime: number, totalDuration: number) => void;
  onTheoryComplete: (answers: { question: string; answer: string }[]) => void;
  onPracticalComplete: (answers: { question: string; answer: string }[]) => void;
  onMCQComplete: (answers: { question: string; answer: string }[]) => void;
  report: EvaluatedAnswer | null; 
}
export interface ILessonDiscussionProps {
  comments: IComment[];
  videoCompleted: boolean;
  onAddComment: (comment: string) => Promise<void>;
}
  export interface ILessonHeaderProps {
    lesson: ILessons;
    report: EvaluatedAnswer | null;
    allSectionsCompleted: boolean;
    onBack: () => void;
    onViewReport: () => void;
  }
 export  interface ILessonProgressBarProps {
    progress: number;
  }
 export  interface IReportModalProps {
  report: string;
  isOpen: boolean;
  onClose: () => void;
}
export interface IFormOTPProps {
  label: string
  onChange: (e: { target: { id: string; value: string } }) => void
  onVerified: () => void
  onResend?: () => void
  email: string,
}
export interface IFormInputProps {
  label: string;
  type: string;
  id: keyof IUserRegistration;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}
export type SuccessProps = {
  session: IDonation
}
export interface IUserLayoutProps {
  children: ReactNode;
}
export interface IVideoModalProps {
  showVideo: boolean
  onClose: () => void
}
export interface IUserDropdownProps {
  user: IUser | null
  isDropdownOpen: boolean
  setIsDropdownOpen: (value: boolean) => void
  handleLogout: () => void
}

export interface ICategoryCardProps {
  icon: ReactNode
  title: string
  courses: number
}
export interface ICourseCardProps {
  course: ICourse
}
export interface IFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}
export interface ITestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: ReactNode;
  active: boolean;
  onClick?: () => void;
}
export type ViewUserProfile = "profile"
export interface IEditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  email?: string
}
export interface ICodeChallengeProps {
  questions: IQuestions[]
  onComplete: (answers: { question: string; answer: string }[]) => void
  isCompleted: boolean
}
export interface ILevelNavigationProps {
  levels: Level[]
  currentLevelId: number
  completedLevels: number[]
  onLevelSelect: (levelId: number) => void
  isLevelUnlocked: (levelId: number) => boolean
}
export interface IMCQQuestionsProps {
  questions: IQuestions[]
  onComplete: (answers: { question: string; answer: string }[]) => void
  isCompleted: boolean
}
export interface ITheoryQuestionsProps {
  questions: IQuestions[]
  onComplete: (answers: { question: string; answer: string }[]) => void
  isCompleted: boolean
}
export interface IVideoPlayerProps {
  videoUrl: string
  title: string
  onComplete: () => void
  onProgress: (currentTime: number, totalDuration: number) => void
  isCompleted: boolean
  thumbnail: string
  startTime: number
  totalLengthFromAPI?: number
}
