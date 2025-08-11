import { ICourse } from "../../../types/classTypes";
import { IConcern } from "../../../types/concernTypes";
import { IAdminConcernCourseResponseDto, IConcernResponseDto } from "./concern-response.dto";

export class ConcernMapper {
  static toResponseDto(concern: IConcern): IConcernResponseDto {
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

  static toResponseCourseInConcern(course: ICourse): IAdminConcernCourseResponseDto {
    return {
      id: course._id.toString(),
      title: course.title,
    };
  }
}
