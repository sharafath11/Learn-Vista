import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { ICourse } from "../../types/classTypes";

class AdminCourseServices implements IAdminCourseServices{
    constructor() { }
    createClass(data: Partial<ICourse>): void {
        
    }
}
export default AdminCourseServices