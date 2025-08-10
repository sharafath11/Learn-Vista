import { ICourse } from "../../../types/classTypes";
import { IConcern } from "../../../types/concernTypes";
import { AdminConcernCourseResponseDto, ConcernResponseDto } from "./concern-response.dto";

export class ConcernMapper {
  static toResponseDto(concern: IConcern): ConcernResponseDto {
    return {
      id: concern._id.toString(),
      title: concern.title,
      message: concern.message,
      courseId: concern.courseId ? concern.courseId.toString() : undefined,
      status: concern?.status || "open",
      resolution: concern.resolution,
      createdAt: concern.createdAt ? new Date(concern.createdAt) : new Date(),
      updatedAt: concern.updatedAt ? new Date(concern.updatedAt) : new Date(),
    };
  }

  static toResponseCourseInConcern(course: ICourse): AdminConcernCourseResponseDto {
    return {
      id: course._id.toString(),
      title: course.title,
    };
  }
}
