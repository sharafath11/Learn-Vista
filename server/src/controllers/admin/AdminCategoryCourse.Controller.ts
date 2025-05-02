import { Request, Response } from "express";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
@injectable()
class AdminCourseController implements IAdminCourseController{
    constructor(
        @inject(TYPES.AdminCourseService) private adminCourseServices :IAdminCourseServices
    ) { }
   
    async addCategories(req: Request, res: Response): Promise<void> {
        
        try {
            console.log(req.body)
            const { title, discription } = req.body;
            if (!title||!discription) {
                sendResponse(res, 403, "Title and discription most be want", false);
                return
            }
           const data= await this.adminCourseServices.addCategories(title, discription);
            sendResponse(res, 200, "categorie Added succesfull", true,data);
            
        } catch (error) {
          handleControllerError(res, error, 500);
        }
    }
    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.adminCourseServices.getCategory();
            sendResponse(res,200,"",true,data)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async blockCategorie(req: Request, res: Response): Promise<void> {
        try {
            const {id,status}=req.body
            await this.adminCourseServices.blockCategory(id, status);
            sendResponse(res,200,`status change successfull`,true)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    createClass(req: Request, res: Response) {
        try {
            return
            const data = req.body
            console.log("andi",data)
            const result = this.adminCourseServices.createClass(data);
            return sendResponse(res,200,"Course cxreated sicces full",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
}
export default AdminCourseController