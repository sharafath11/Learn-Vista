import { Request, Response } from "express";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
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
    async createClass(req: Request, res: Response) {
        try {
          const data = req.body;
          const thumbnail = req.file;
      
          if (!thumbnail) throwError("Thumbnail image is required", 400);
      
          const result = await this.adminCourseServices.createClass(data, thumbnail.buffer);
      
          return sendResponse(res, 200, "Course created successfully", true, result);
        } catch (error) {
          handleControllerError(res, error);
        }
    }
    async getCourse(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.adminCourseServices.getClass();
            if (!courses) throwError("Somthing wentwrong :)")
            sendResponse(res,200,"",true,courses)
        } catch (error) {
            handleControllerError(res, error); 
        }
    }
    async blockCourses(req: Request, res: Response): Promise<void> {
        try {
            const {id,status}=req.body
            await this.adminCourseServices.blockCourse(id as string, status);
            sendResponse(res,200,`Status ${status} changed `,true)
        } catch (error) {
            handleControllerError(res, error)
        }
    }

      
}
export default AdminCourseController