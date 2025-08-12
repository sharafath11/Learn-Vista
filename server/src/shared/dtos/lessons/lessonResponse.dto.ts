// dto/lessonResponse.dto.ts
export interface ILessonResponseDto {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  courseId: string;
  order?: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface IAdminLessonResponseDto{
  id: string;
  title: string
  videoUrl: string
  description: string
  thumbnail:string
}
export interface IMentorLessonResponseDto {
   id: string;
  title: string
  videoUrl: string
  description: string
  thumbnail:string
}
