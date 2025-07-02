import { ObjectId } from "mongoose";
import { ICategory, ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IConcern } from "../../../../types/concernTypes";
type ConcernFilter = {
  status?: 'open' | 'in-progress' | 'resolved';
  courseId?: string;
};
type SortOrder = 1 | -1;
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
    editCategories(courseId: string, title: string, discription: string): Promise<ICategory>
    getConcern(): Promise<IConcern[]>
    updateConcern(concernId: string, updateData: Partial<IConcern>): Promise<void>;

  updateConcernStatus(
    concernId: string|ObjectId,
    status: 'resolved' | 'in-progress',
    resolution: string
  ): Promise<void>;
   getAllConcerns(
  filters: ConcernFilter,
  limit: number,
  skip: number,
  sort: Record<string, SortOrder>
): Promise<{ concerns: IConcern[]; courses: ICourse[] }>;


  countAllConcerns(filters: ConcernFilter): Promise<number>;
}