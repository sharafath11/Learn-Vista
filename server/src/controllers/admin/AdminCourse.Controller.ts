import { Request, Response } from "express";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
@injectable()
class AdminCourseController implements IAdminCourseController{
    constructor(
        @inject(TYPES.AdminCourseServices) private adminCourseServices :IAdminCourseServices
    ) { }
    createClass(req:Request,res:Response) {
    }
}
export default AdminCourseController