import { ILesson, ILessonReport } from "../../../types/lessons";
import { IUserLessonProgress } from "../../../types/userLessonProgress";
import {  IAdminLessonResponseDto, ILessonResponseDto, IMentorLessonResponseDto, IUserLessonProgressDto, IUserLessonReportResponse, IUserLessonResponseDto} from "./lessonResponse.dto";


export class LessonMapper {
  static toLessonResponseDto(lesson: ILesson): ILessonResponseDto {
    console.log(lesson)
    return {
      id: lesson._id.toString(),
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      thumbnail: typeof lesson.thumbnail === "string" ? lesson.thumbnail : undefined,
      duration: lesson.duration,
      description: lesson.description,
      courseId: lesson.courseId.toString(),
      order: lesson.order,
      isFree: lesson.isFree,
      createdAt: lesson.createdAt?.toISOString() ?? "",
      updatedAt: lesson.updatedAt?.toISOString() ?? "",
    };
  }
  static toAdminLessonResponseDto(lesson: ILesson):IAdminLessonResponseDto {
    return {
      id: lesson._id.toString(),
      title: lesson.title,
      description: lesson?.description||"",
      thumbnail: lesson.thumbnail as string,
      videoUrl:lesson.videoUrl
    }
  }
  static toMentorLessonResponseDto(lesson: ILesson): IMentorLessonResponseDto{
    return {
      id: lesson._id.toString(),
      title: lesson.title,
      description: lesson?.description||"",
      thumbnail: lesson.thumbnail as string,
      videoUrl:lesson.videoUrl
    }
  }
  static toLessonUserResponseDto(lesson: ILesson): IUserLessonResponseDto{
    console.log("lesson",lesson)
     return {
      id: lesson._id.toString(),
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      thumbnail: typeof lesson.thumbnail === "string" ? lesson.thumbnail : undefined,
      duration: lesson.duration,
      description: lesson.description,
      courseId: lesson.courseId.toString(),
    };
  }
  static toLessonProgressUser(p: IUserLessonProgress): IUserLessonProgressDto {
  console.log("progress",p)
  return {
    id: p._id.toString(),
    courseId: p.courseId.toString(),
    lessonId: p.lessonId.toString(),
    videoProgressPercent: p.videoProgressPercent,
    videoWatchedDuration: p.videoWatchedDuration,
    videoTotalDuration: p.videoTotalDuration,
    theoryCompleted: p.theoryCompleted,
    practicalCompleted: p.practicalCompleted,
    mcqCompleted: p.mcqCompleted,
    overallProgressPercent: p.overallProgressPercent,
    videoCompleted: p.videoCompleted
  };
}
  static lessonReportToresponse(l: ILessonReport): IUserLessonReportResponse{
    
    return {
      report: l.report 
  }
}
}
