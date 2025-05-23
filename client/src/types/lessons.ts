export interface ILessons {
  id:string
  title: string;
  videoUrl: string;
  thumbnail?: string;  
  duration?: string;
  description?: string;
  courseId:string;
  order?: number;
  isFree: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}