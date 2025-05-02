import { ICategory, ICourse } from "../../../../types/classTypes";

export interface IAdminCourseServices{
    createClass(data: Partial<ICourse>): Promise<ICourse>
    blockCourse(id:string,status:boolean):void
    getClass():Promise<ICourse[]>
    addCategories(title: string, discription: string): Promise<ICategory>
    getCategory(): Promise<ICategory[]>
    blockCategory(id: string, status: boolean): Promise<void>
    
}