
import { ICategory } from "./categoryTypes";
import { ILessons } from "./lessons";
import { IMentor } from "./mentorTypes";

export interface ICourse {
  id: string;
  _id: string;
  title: string;
  description?: string;
  mentorId: string | IMentor;
  mentorStatus: "approved" | "rejected" | "pending";
  sessions: string[];
  categoryId: string | ICategory;
  categoryName?:string;
  price?: number;
  courseLanguage?: string;
  isBlock: boolean;
  tags?: string[];
  currentTag?: string;
  enrolledUsers?:string[]
  startDate: string;
  endDate: string;
  startTime: string;
  isStreaming?:boolean
  thumbnail?: string;
  thumbnailPreview?: string | null;
  Lessons: string[] | ILessons[]
   lessons?:string[]|ILessons[]
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedCourse extends Omit<ICourse, 'mentorId' | 'categoryId'> {
  mentorId: IMentor;
  categoryId: ICategory;
}

export interface ICourseFormData {
  title: string;
  description: string;
  category: string;
  price: string | number;
  language: string;
  tags: string[];
  currentTag: string;
  startDate: string;
  endDate: string;
  startTime: string;
  thumbnail?: File;
  thumbnailPreview?: string | null;
}

export interface ClassSession {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  students: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  topic: string;
  description?: string;
}