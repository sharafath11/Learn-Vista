import { ICategory, ICourse, IPopulatedCourse } from "../../../../types/classTypes";

export interface IAdminCourseServices{
    createClass(data: Partial<ICourse>,thumbinal:Buffer): Promise<ICourse>
    blockCourse(id:string,status:boolean):void
    getClass(page?: number,
        limit?: number,
        search?: string,
        filters?: Record<string, any>,
        sort?: Record<string, 1 | -1>): Promise<{ data: ICourse[]; total: number; totalPages?: number }>;
    addCategories(title: string, discription: string): Promise<ICategory>
    getAllCategory():Promise<ICategory[]>
    getCategory(page?: number,
        limit?: number,
        search?: string,
        filters?: Record<string, any>,
        sort?: Record<string, 1 | -1>): Promise<{ data: ICategory[]; total: number; totalPages?: number }>;
    blockCategory(id: string, status: boolean): Promise<void>
    editCourseService(courseId:string,data:ICourse,thumbinal?:Buffer):Promise<ICourse>
    editCategories(courseId:string,title:string,discription:string):Promise<ICategory>
}