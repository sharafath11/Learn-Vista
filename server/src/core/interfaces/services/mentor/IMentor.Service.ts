import { ICategory, ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IMentor } from "../../../../types/mentorTypes";


export interface IMentorService {
  getMentor(id: string): Promise<Partial<IMentor>>;
  getCourses(id: string): Promise<IPopulatedCourse[]>;
  courseApproveOrReject(id: string, courseId: string, status: string, courseRejectReson: string): Promise<void>
  courseWithPagenated(params: {
  mentorId: string;
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  }): Promise<{ data: IPopulatedCourse[]; total: number; categories:ICategory[] }>;

}