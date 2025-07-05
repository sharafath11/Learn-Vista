
import { ObjectId } from "mongoose";
import { ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface ICourseRepository extends IBaseRepository <ICourse, ICourse>{
    findWithMenorIdgetAllWithPopulatedFields(id: string|ObjectId): Promise<IPopulatedCourse[]>;
    populateWithAllFildes(): Promise<IPopulatedCourse[]>
    fetchAllCoursesWithFilters(params: {
        page?: number;
        limit?: number;
        search?: string;
        filters?: { categoryId?: string };
        sort?: { [key: string]: 1 | -1 };
    }): Promise<{ data: IPopulatedCourse[]; total: number; totalPages: number }>
    fetchMentorCoursesWithFilters(params: {
  mentorId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: { categoryId?: string };
  sort?: { [key: string]: 1 | -1 };
}): Promise<{ data: IPopulatedCourse[]; total: number; totalPages: number }>;

AdmingetClassRepo(
    page: number,
    limit: number,
    search?: string,
    filters?: any,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICourse[]; total: number; totalPages: number }>;
}