import { ICategory } from "./categoryTypes";
import { IConcern } from "./concernTypes";
import { IPopulatedCourse } from "./courseTypes";
import { ILessons, IMentorComments } from "./lessons";
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

