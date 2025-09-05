import { ObjectId } from "mongoose";
import { IComment,  ILessonDetails, ILessonReport, IQuestions, LessonQuestionInput } from "../../../../types/lessons";
import { IUserLessonProgress } from "../../../../types/userLessonProgress";
import { IUserLessonProgressDto, IUserLessonReportResponse, IUserLessonResponseDto, IUserVoiceNoteResponseDto } from "../../../../shared/dtos/lessons/lessonResponse.dto";
import { IUserQustionsDto } from "../../../../shared/dtos/question/question-response.dto";
import { IUserCommentResponseAtLesson } from "../../../../shared/dtos/comment/commentResponse.dto";
export interface GetLessonsResponse {
  lessons: IUserLessonResponseDto[];
  progress: IUserLessonProgressDto[];
}
export interface IUserLessonsService {
  getLessons(courseId: string | ObjectId, userId: string): Promise<GetLessonsResponse>
  getQuestions(lessonId: string | ObjectId): Promise<IUserQustionsDto[]>
  getLessonDetils(lessonId: string | ObjectId, userId: string | ObjectId): Promise<ILessonDetails>
  lessonReport(userId: string | ObjectId, lessonId: string, data: LessonQuestionInput): Promise<IUserLessonReportResponse>
  saveComments(userId: string, lessonId: string | ObjectId, commant: string): Promise<IUserCommentResponseAtLesson>
  updateLessonProgress(
    userId: string,
    lessonId: string,
    update: {
      videoWatchedDuration?: number;
      videoTotalDuration?: number;
      theoryCompleted?: boolean;
      practicalCompleted?: boolean;
      mcqCompleted?: boolean;
      videoCompleted?: boolean
    }
  ): Promise<IUserLessonProgressDto | null>;
  saveVoiceNote(
    userId: string,
    courseId: string | ObjectId,
    lessonId: string | ObjectId,
    note: string
  ): Promise<void>;
getVoiceNotes(
  userId: string,
  lessonId: string | ObjectId,
  params: { search?: string; sort?: "asc" | "desc"; limit: number; page: number }
): Promise<{ notes: IUserVoiceNoteResponseDto[]; totalNotes: number }>;

   editVoiceNote(
    userId: string,
    lessonId: string | ObjectId,
    voiceNoteId: string | ObjectId,
    note: string
  ): Promise<IUserVoiceNoteResponseDto>;
  
  deleteVoiceNote(
    userId: string,
    lessonId: string | ObjectId,
    voiceNoteId: string | ObjectId
  ): Promise<void>;
}
