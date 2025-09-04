import { LessonQuestionEvaluation } from "../../../types/lessons";

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


//user ;lesson
export interface IUserLessonProgressDto {
  id:string,
  courseId: string;
  lessonId: string;
  videoProgressPercent: number;
  videoWatchedDuration: number;
  videoTotalDuration: number;
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  overallProgressPercent: number;
  videoCompleted: boolean;
}
export interface IUserLessonResponseDto {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  courseId: string;
}
export interface IUserLessonReportResponse {
    report: LessonQuestionEvaluation |string;
    createdAt?: Date;
}

export interface IUserVoiceNoteResponseDto {
  id: string;
  course: string;
  lesson: string;
  note: string;
  PrefectNote: string
  notedDate:Date
}
