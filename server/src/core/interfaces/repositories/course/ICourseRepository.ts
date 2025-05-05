
import { ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface ICourseRepository extends IBaseRepository <ICourse, ICourse>{
    findWithMenorIdgetAllWithPopulatedFields(id: string): Promise<IPopulatedCourse[]>;
    populateWithAllFildes():Promise<IPopulatedCourse[]>

}