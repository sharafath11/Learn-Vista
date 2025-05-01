import { ICourse } from "../../../../types/classTypes";

export interface IAdminCourseServices{
    createClass(data:Partial<ICourse>):void
}