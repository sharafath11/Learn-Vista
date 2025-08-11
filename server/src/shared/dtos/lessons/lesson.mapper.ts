import { ILesson } from "../../../types/lessons";
import { IAdminLessonResponseDto, ILessonResponseDto} from "./lessonResponse.dto";


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
}
