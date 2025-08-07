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

export type QuestionType = "theory" | "practical" | "mcq";
export interface IQuestions {
  id: string;
  lessonId: string;
  question: string;
  type: QuestionType;
  isCompleted: boolean;
  options?: string[]; 
  correctAnswer?: string | string[]; 
}
export type AnswerWithType = {
  question: string;
  answer: string | string[]; 
  type: QuestionType;
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
  type: 'theory' | 'practical'|"mcq";
  studentAnswer: string;
  answer?:string
  isCorrect: boolean;
  feedback: string;
  marks: number; 
  report?:string
};

export interface ILessonProgressUpdate {
  videoWatchedDuration?: number;
  videoTotalDuration?: number;
  videoCompleted?: boolean;
  theoryCompleted?: boolean;
  practicalCompleted?: boolean;
  mcqCompleted?: boolean;
}