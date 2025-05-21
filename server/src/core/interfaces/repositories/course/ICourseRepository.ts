
import { ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface ICourseRepository extends IBaseRepository <ICourse, ICourse>{
    findWithMenorIdgetAllWithPopulatedFields(id: string): Promise<IPopulatedCourse[]>;
    populateWithAllFildes(): Promise<IPopulatedCourse[]>
    fetchAllCoursesWithFilters(params: {
        page?: number;
        limit?: number;
        search?: string;
        filters?: { category?: string };
        sort?: { [key: string]: 1 | -1 };
    }):Promise<{ data: IPopulatedCourse[]; total: number; totalPages: number }>

}