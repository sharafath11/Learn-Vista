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
export type AnswerWithType = {
  question: string;
  answer: string;
  type: 'theory' | 'practical';
};

export interface IComment  {
  id?:string
  lessonId:  string;
  userId?: string;
  userName: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type EvaluatedAnswer = {
  question: string;
  type: 'theory' | 'practical';
  studentAnswer: string;
  isCorrect: boolean;
  feedback: string;
  marks: number; 
  report?:string
};