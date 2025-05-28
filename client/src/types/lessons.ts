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

export type qustionType="theory"|"practical"
export interface IQuestions  {
  id:string
  lessonId: string;
  question: string;
  type:"theory"|"practical"
  isCompleted: boolean;
}