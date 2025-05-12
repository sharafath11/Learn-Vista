import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { validateCategory } from "../../validation/adminValidation";

@injectable()
class AdminCourseController implements IAdminCourseController {
  constructor(
    @inject(TYPES.AdminCourseService) private adminCourseServices: IAdminCourseServices
  ) {}

  async addCategories(req: Request, res: Response): Promise<void> {
    try {
      const { title, discription } = req.body;
      const validationError = validateCategory(title, discription);

      if (validationError) {
        return sendResponse(res, StatusCode.BAD_REQUEST, validationError, false);
      }
  
      if (!title || !discription) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Title and description are required", false);
      }

      const data = await this.adminCourseServices.addCategories(title, discription);
      sendResponse(res, StatusCode.OK, "Category added successfully", true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;
     
         const page = Math.max(Number(queryParams.page) || 1, 1);
         const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
         const search = queryParams.search?.toString() || '';
         const sort: Record<string, 1 | -1> = {};
         console.log("queryParams.sort", queryParams);
     
         if (queryParams.sort) {
           for (const key in queryParams.sort) {
             const value = queryParams.sort[key];
             if (value === 'asc' || value === '1' || value === 1) {
               sort[key] = 1;
             } else if (value === 'desc' || value === '-1' || value === -1) {
               sort[key] = -1;
             } else {
               console.warn(` Invalid sort value for ${key}: ${value}, defaulting to -1`);
               sort[key] = -1;
             }
           }
           console.log("Sort:", sort);
         } else {
           sort.createdAt = -1;
           console.log(" Default Sort: createdAt DESC");
         }
     
      const data = await this.adminCourseServices.getCategory( page,
        limit,
        search,
        queryParams.filters,
        sort);
      sendResponse(res, StatusCode.OK, "Categories retrieved successfully", true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCategorie(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;
      await this.adminCourseServices.blockCategory(id, status);
      sendResponse(res, StatusCode.OK, `Category status updated successfully`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async editCategories(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body",req.body)
      const { id, title, discription } = req.body;
      const validationError = validateCategory(title, discription);

      if (validationError) {
        return sendResponse(res, StatusCode.BAD_REQUEST, validationError, false);
      }
  
      if (!title || !discription) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Title and description are required", false);
      }
        if (!id || !title || !discription) {
          sendResponse(res, StatusCode.BAD_REQUEST, "Missing required fields", false);
          return 
        }
        const description=discription
        const result = await this.adminCourseServices.editCategories(
          id, 
            title, 
            description
        );
        
        sendResponse(res, StatusCode.OK, "Course edited suyuccesfulyy", true,result);

    } catch (error) {
        handleControllerError(res,error)
    }
}

async editCourse(req: Request, res: Response): Promise<void> {
  try {
    console.log("req.body",req.body,req.file)
        const { courseId, data } = req.body;
        const thumbnail = req.file?.buffer;
        
        if (!courseId || !data) {
          sendResponse(res, StatusCode.BAD_REQUEST, "Missing required fields", false);
          return 
        }

        const result = await this.adminCourseServices.editCourseService(
            courseId, 
            data, 
            thumbnail
        );
        
        sendResponse(res, StatusCode.OK, "Course edited suyuccesfulyy", true,result);
    } catch (error) {
        console.error(error);
        handleControllerError(res,error)
    }
}
  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const thumbnail = req.file;

      if (!thumbnail) throwError("Thumbnail image is required", StatusCode.BAD_REQUEST);

      const result = await this.adminCourseServices.createClass(data, thumbnail.buffer);
      sendResponse(res, StatusCode.OK, "Course created successfully", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getCourse(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;
     
      const page = Math.max(Number(queryParams.page) || 1, 1);
      const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
      const search = queryParams.search?.toString() || '';
      const sort: Record<string, 1 | -1> = {};
      console.log("queryParams.sort",queryParams);
  
      if (queryParams.sort) {
        for (const key in queryParams.sort) {
          const value = queryParams.sort[key];
          if (value === 'asc' || value === '1' || value === 1) {
            sort[key] = 1;
          } else if (value === 'desc' || value === '-1' || value === -1) {
            sort[key] = -1;
          } else {
            console.warn(` Invalid sort value for ${key}: ${value}, defaulting to -1`);
            sort[key] = -1;
          }
        }
        console.log("Sort:", sort);
      } else {
        sort.createdAt = -1;
        console.log(" Default Sort: createdAt DESC");
      }
      console.log(" Default Sort: createdAt DESC",queryParams.filters);
      let sendFilter: any = {};

if (queryParams.filters?.isBlocked !== undefined) {
  if (queryParams.filters.isBlocked === 'false') {
    sendFilter.isBlock = false;
  } else {
    sendFilter.isBlock = true;
  }
}
      
      const courses = await this.adminCourseServices.getClass(  page,
        limit,
        search,
        sendFilter,
        sort);
      if (!courses) throwError("Something went wrong", StatusCode.INTERNAL_SERVER_ERROR);
      sendResponse(res, StatusCode.OK, "Courses retrieved successfully", true, courses);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCourses(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;
      await this.adminCourseServices.blockCourse(id, status);
      sendResponse(res, StatusCode.OK, `Course status updated to ${status}`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminCourseController;
