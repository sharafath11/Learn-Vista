import { ICategoryMentorCourseResponse } from "../../../../shared/dtos/categories/category-response.dto";
import { ICourseMentorResponseDto } from "../../../../shared/dtos/courses/course-response.dto";
import { ICategory, IPopulatedCourse } from "../../../../types/classTypes";

export interface IMentorCourseService {
  getCourses(mentorId: string): Promise<ICourseMentorResponseDto[]>;
  courseApproveOrReject(
    mentorId: string,
    courseId: string,
    status: string,
    courseRejectReason?: string
  ): Promise<void>;
  courseWithPagenated(options: {
    mentorId: string;
    page: number;
    limit: number;
    search?: string;
    filters?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
  }): Promise<{
    data: ICourseMentorResponseDto[];
    total: number;
    categories: ICategoryMentorCourseResponse[];
  }>;
  publishCourse(courseId:string,status:boolean):Promise<void>
}
