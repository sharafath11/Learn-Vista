import { IMentor } from "../../../types/mentorTypes";
import { ICategoryResponseDto } from "../categories/category-response.dto";

export class CourseResponseDto {
  id!: string;
  title!: string;
  description?: string;
  mentorId!: string;
  sessions!: string[];
  categoryId!: string;
  mentor!: IMentor;
  students!: number;
  categoryName!: string;
  courseLanguage?: string;
  isBlock!: boolean;
  tags?: string[];
  enrolledUsers!: string[];
  endTime?: string;
  isActive!: boolean;
  isStreaming?: boolean;
  lessons!: string[];
  category!: ICategoryResponseDto;
  mentorStatus!: "approved" | "rejected" | "pending";
  isCompleted!: boolean;
  currentTag?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  thumbnail?: string; 
  createdAt!: Date;
  updatedAt!: Date;
}
