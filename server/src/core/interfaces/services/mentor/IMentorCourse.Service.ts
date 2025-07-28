import { ICategory, IPopulatedCourse } from "../../../../types/classTypes";

export interface IMentorCourseService {
  getCourses(mentorId: string): Promise<IPopulatedCourse[]>;
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
    data: IPopulatedCourse[];
    total: number;
    categories: ICategory[];
  }>;
  publishCourse(courseId:string,status:boolean):Promise<void>
}
