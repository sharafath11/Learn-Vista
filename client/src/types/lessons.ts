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

export interface Level {
  id: number
  title: string
  description?:string
  duration: number 
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
export interface IMentorComments{
  userName:string
createdAt:Date
courseTitle:string
lessonTitle:string
comment:string
}




export type SortOption = "newest" | "oldest";

export interface IVoiceNote {
  id: string;
  course: string;
  lesson: string;
  note: string;
  PrefectNote: string;
  notedDate: Date|string;
}


export interface IAdminLessonModalProps {
  open: boolean;
  onClose: () => void;
  type: 'comments' | 'questions' | null;
  lesson: ILessons | null;
  comments: IComment[];
  questions: IQuestions[];
}
export interface IMentorCourseLessonsPageProps {
  params: Promise<{
    courseId: string;
  }>
}
export type IMentorSortOption = "newest" | "oldest"
export type IMentorFilterOption = "all" | string
export interface IQuestion {
  id?: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}
export interface PSCQuestion {
  id: number;
  question: string;
  options: string[];
}
export interface PSCCheckResponse {
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string;
}
