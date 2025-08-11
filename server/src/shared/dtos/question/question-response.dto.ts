import { IQuestions, QuestionType } from "../../../types/lessons";


export interface IQuestionResponseDto {
  id: string;
  lessonId: string;
  question: string;
  type: QuestionType;
  isCompleted: boolean;
  options?: string[];
  correctAnswer?: string;
  createdAt: Date;
}

export interface IQuestionAdminResponseDto {
  id: string;
  question: string;
  type: QuestionType;
  lessonId:string
}
