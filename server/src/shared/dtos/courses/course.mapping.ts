import { ICategory, ICourse, IPopulatedCourse } from "../../../types/classTypes";
import { IMentor } from "../../../types/mentorTypes";
import { CategoryMapper } from "../categories/category.mapper";
import { ICourseAdminResponse, ICourseMentorResponseDto, ICourseResponseDto } from "./course-response.dto";

export class CourseMapper {
  static toResponseDto(course: ICourse): ICourseResponseDto {
    return {
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      mentorId: course.mentorId.toString(),
      sessions: course.sessions.map(s => s.toString()),
      categoryId: course.categoryId.toString(),
      mentor: course.mentor,
      students: course.students,
      categoryName: course.categoryName,
      courseLanguage: course.courseLanguage,
      isBlock: course.isBlock,
      tags: course.tags,
      enrolledUsers: course.enrolledUsers,
      endTime: course.endTime,
      isActive: course.isActive,
      isStreaming: course.isStreaming,
      lessons: course.lessons.length,
      category: CategoryMapper.toResponsePopulatedAdminCourse(course.category), 
      mentorStatus: course.mentorStatus,
      isCompleted: course.isCompleted,
      currentTag: course.currentTag,
      startDate: course.startDate,
      endDate: course.endDate,
      startTime: course.startTime,
      thumbnail: course.thumbnail,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
  static toResponsePopulatedAdminCourse(course: ICourse): ICourseAdminResponse {
      console.log(course)
    return {
    id:course._id.toString(),
    title: course.title,
    mentor:  (course.mentorId as unknown as IMentor)?.username || "", 
    category: course.categoryName,
    startDate: course.startDate || "",
    endDate: course.endDate || "",
    startTime: course.startTime || "",
        isActive: course.isActive,
    isBlock:course.isBlock,
      thumbnail: course.thumbnail || "",
    description:course.description
 
  }
}
  static toResponseMentorCourse(course: IPopulatedCourse):ICourseMentorResponseDto {
       return {
      id: course._id.toString(),
      title: course.title,
      description: course.description||"",
      mentor: course.mentorId?.toString() || "",
      sessions: course.sessions?.length || 0,
      categoryName: course.categoryName,
      thumbnail: course.thumbnail || "",
         isActive: course.isActive ?? false,
      totelStudent:course.enrolledUsers.length,
      startDate: course.startDate||"",
      endDate: course.endDate||"",
      startTime: course.startTime || "",
    };
}
}
