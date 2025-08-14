import { ICategory, ICourse, IPopulatedCourse } from "../../../types/classTypes";
import { IMentor } from "../../../types/mentorTypes";
import { IUserCourseProgress } from "../../../types/userCourseProgress";
import { getSignedS3Url } from "../../../utils/s3Utilits";
import { CategoryMapper } from "../categories/category.mapper";
import { ICourseAdminResponse, ICourseMentorResponseDto, ICourseResponseDto, ICourseUserResponseDto, IUserCourseProgressResponse } from "./course-response.dto";

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
      console.log("responseeesssseeeeee",course)
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
 static  toResponseUserCourse(c: IPopulatedCourse,mentorPhoto:string): ICourseUserResponseDto {
  return {
    id: c._id.toString(),
    title: c.title,
    description: c.description ?? "",
    mentorEmail: c.mentorId?.email ?? "",
    Mentorusername: c.mentorId?.username ?? "",
    mentorPhoto, 
    mentorExpertise: c.mentorId?.expertise ?? [], 
    sessions: c.sessions?.length ?? 0,
    categoryName: c.category?.title ?? c.categoryName ?? "",
    thumbnail: c.thumbnail ?? "",
    students: c.enrolledUsers.length ?? 0,
    isBlock: c.isBlock,
    tags:c.tags,
    courseLanguage:c.courseLanguage,
    startDate: c.startDate ? new Date(c.startDate) : new Date(),
    endDate: c.endDate ? new Date(c.endDate) : new Date(),
    startTime: c.startTime ?? ""
  };
 }
  static toResponseUserCourseProgress(p: IUserCourseProgress): IUserCourseProgressResponse{
    return {
      id:p._id.toString(),
      courseId: p.courseId.toString(),
      completedLessons: p.completedLessons.map((i)=>i.toString()),
      overallProgressPercent: p.overallProgressPercent,
      totalLessons:p.totalLessons,
    }
  }

}
