import { ICourse } from "../../../types/classTypes";
import { IConcern } from "../../../types/concernTypes";
import { IAdminConcernCourseResponseDto, IConcernResponseDto, IConernMentorResponse, IMentorConcernAttachment } from "./concern-response.dto";

export class ConcernMapper {
  static toResponseDto(concern: IConcern): IConcernResponseDto {
    return {
      id: concern._id.toString(),
      title: concern.title,
      message: concern.message,
      courseId: concern.courseId ? concern.courseId.toString() : undefined,
      status: concern?.status || "open",
      resolution: concern.resolution,
      attachments:concern.attachments||[],
      createdAt: concern.createdAt ? new Date(concern.createdAt) : new Date(),
      updatedAt: concern.updatedAt ? new Date(concern.updatedAt) : new Date(),
      mentorId:concern.mentorId.toString()
    };
  }

  static toResponseCourseInConcern(course: ICourse): IAdminConcernCourseResponseDto {
    return {
      id: course._id.toString(),
      title: course.title,
    };
  }
    static toMentorResponseConcern(
    concern: IConcern,
    courseTitle: string
  ): IConernMentorResponse {
      return {
  createdAt:concern.createdAt||new Date,
    id: concern._id.toString(),
    title: concern.title,
    message: concern.message,
    attachments: mapAttachment(concern.attachments),
    courseTitle,
    status: concern.status || "open",
        resolution: concern.resolution,
    courseId:concern.courseId.toString()
  };
  }
}
function mapAttachment(attachments?: IConcern["attachments"]): IMentorConcernAttachment[] {
  if (!attachments) return [];
  return attachments.map(att => ({
    url: att.url,
    type: att.type,
    filename: att.filename,
  }));
}
