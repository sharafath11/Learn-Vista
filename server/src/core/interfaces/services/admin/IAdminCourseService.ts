import { ICategory, ICourse, IPopulatedCourse } from "../../../../types/classTypes";

export interface IAdminCourseServices{
    createClass(data: Partial<ICourse>,thumbinal:Buffer): Promise<ICourse>
    blockCourse(id:string,status:boolean):void
    getClass():Promise<IPopulatedCourse[]>
    addCategories(title: string, discription: string): Promise<ICategory>
    getCategory(): Promise<ICategory[]>
    blockCategory(id: string, status: boolean): Promise<void>
    
}