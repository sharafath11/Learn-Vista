import { ICategory } from "./categoryTypes";
import { IConcern } from "./concernTypes";
import { IPopulatedCourse } from "./courseTypes";
import { ILessons, IMentorComments } from "./lessons";
import { IMentor, IMentorSignupData, SocialLink } from "./mentorTypes";
import { INotification } from "./notificationsTypes";
import { IUser } from "./userTypes";

export interface IMentorAddLessonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nextOrder: number;
  courseId: string;
  onLessonAdded: () => void;
}
export interface IMentorCommentsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  lessonId: string;
}
export interface IMentorEditLessonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLesson: ILessons | null;
  onLessonUpdated: () => void;
  courseId: string;
}
export interface IMentorConcernCardProps {
  concern: IConcern;
}

export interface IMentorStudentDetailsModalProps {
  student: IUser
  isOpen: boolean
  onClose: () => void
}
export interface IMentorStudentCardProps {
  student: IUser
  onView: (id: string) => void
  onToggleBlock: (id: string, shouldBlock: boolean) => void
  courseId: string
}
export interface IMentorCourseFiltersProps {
  categories: ICategory[]
  onChange: (filters: {
    search: string
    sort: "latest" | "oldest"
    category: string
  }) => void
}
export interface IMentorCommentCardProps {
  comment: IMentorComments
  course?: string 
  lessonTitle: string
  formatDate: (date: Date | undefined) => string
}
export interface IMentorSessionTableProps {
  sessions: IPopulatedCourse[]
  isEnded?: boolean
  handleStartSession: (courseId: string) => void
  getSessionStatus: (session: IPopulatedCourse) => string
}

export interface IMentorNotificationProps {
  mentorNotification: INotification[] 
  setMentorNotifications: (notifications: any[]) => void
  mentorUnreadNotification: number
  setMentorUnreadNotification: (count: number) => void
  refreshMentorNotification: () => void
  isMobile?: boolean
}
export type IMentorView = "profile" | "forgotPassword" | "resetSent";

export interface IMentorEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface IMentorProfileInfoProps {
  mentor: IMentor | null;
}
export type IMentorExpertiseInputProps = {
  mentorData: IMentorSignupData;
  onAddExpertise: (expertise: string[]) => void;
  onRemoveExpertise: (index: number) => void;
};
export type IMentorSocialLinksInputProps = {
  mentorData: IMentorSignupData;
  onAddSocialLink: (link: SocialLink) => void;
  onRemoveSocialLink: (index: number) => void;
};