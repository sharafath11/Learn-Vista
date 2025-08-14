import { IMentor } from "../../../types/mentorTypes";
import { ICategoryCoursePopulated, ICategoryResponseDto } from "../categories/category-response.dto";

export interface ICourseResponseDto {
  id: string;
  title: string;
  description?: string;
  mentorId: string;
  sessions: string[];
  categoryId: string;
  mentor: IMentor;
  students: number;
  categoryName: string;
  courseLanguage?: string;
  isBlock: boolean;
  tags?: string[];
  enrolledUsers: string[];
  endTime?: string;
  isActive: boolean;
  isStreaming?: boolean;
  lessons: number;
  category: ICategoryCoursePopulated;
  mentorStatus: "approved" | "rejected" | "pending";
  isCompleted: boolean;
  currentTag?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  thumbnail?: string; 
  createdAt: Date;
  updatedAt: Date;
}
export interface ICourseAdminResponse {
  id:string
  title: string;       
  category: string;   
  mentor: string;      
  startDate: string;   
  endDate: string;     
  thumbnail:string
  startTime: string;   
  isBlock:boolean
  isActive: boolean
  description?:string
}
export interface ICourseMentorResponseDto{
  id: String,
  title: string,
  description: string,
  mentor: string,
  sessions: number,
  categoryName: string;
  thumbnail: string;
  totelStudent?:number
  isActive: boolean;
  startDate: string;
  endDate: string,
  startTime:string
}
export interface ICourseUserResponseDto{
  id: string,
  title: string,
  description: string;
  mentorEmail: string,
  Mentorusername: string,
  enrolledUsers:string[]
  mentorExpertise: string[],
  mentorPhoto?:string
  courseLanguage?:string
  sessions: number,
  tags?:string[]
  categoryName: string,
  thumbnail: string,
  students:number,
  isBlock:boolean
  startDate: Date,
  endDate: Date,
  startTime:string
}
export interface IUserCourseProgressResponse{
  id:string
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  overallProgressPercent: number;
}