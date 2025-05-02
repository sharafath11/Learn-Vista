import { ICategory, ICourse } from "../../../../types/classTypes";

export interface IAdminCourseServices{
    createClass(data: Partial<ICourse>): void
    addCategories(title: string, discription: string): Promise<ICategory>
    getCategory(): Promise<ICategory[]>
    blockCategory(id:string,status:boolean):Promise<void>
}