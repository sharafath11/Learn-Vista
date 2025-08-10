// import { ICourse } from "../../../types/classTypes";
// import { CourseResponseDto } from "./course-response.dto";

// export class CourseMapper {
//   static toResponseDto(course: ICourse): CourseResponseDto {
//     return {
//       id: course._id.toString(),
//       title: course.title,
//       description: course.description,
//       mentorId: course.mentorId.toString(),
//       sessions: course.sessions.map(s => s.toString()),
//       categoryId: course.categoryId.toString(),
//       mentor: course.mentor,
//       students: course.students,
//       categoryName: course.categoryName,
//       courseLanguage: course.courseLanguage,
//       isBlock: course.isBlock,
//       tags: course.tags,
//       enrolledUsers: course.enrolledUsers,
//       endTime: course.endTime,
//       isActive: course.isActive,
//       isStreaming: course.isStreaming,
//       lessons: course.lessons.map((i:string)=>i._id as string),
//       category: course.category,
//       mentorStatus: course.mentorStatus,
//       isCompleted: course.isCompleted,
//       currentTag: course.currentTag,
//       startDate: course.startDate,
//       endDate: course.endDate,
//       startTime: course.startTime,
//       thumbnail: course.thumbnail, 
//       createdAt: course.createdAt,
//       updatedAt: course.updatedAt,
//     };
//   }
// }
