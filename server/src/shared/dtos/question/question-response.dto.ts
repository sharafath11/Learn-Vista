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
  options?:string[]
  lessonId:string
}
export interface IMentorQustionsDto{
  question: string;
  options?:string[]
  type: QuestionType;
}
export interface IUserQustionsDto{
  id:string
  question: string;
  options?:string[]
  type: QuestionType;
}