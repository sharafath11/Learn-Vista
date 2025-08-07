import { Request, Response } from "express";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";
import { decodeToken } from "../../utils/JWTtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
export class UserCourseController implements IUserCourseController {
    constructor(
        @inject(TYPES.UserCourseService) private _userCourseService: IUserCourseService
    ) {}

    async getAllCourse(req: Request, res: Response): Promise<void> {
        try {
            const queryParams = (req.query as any).params || req.query;
        const decode=decodeToken(req.cookies.token)
         const page = Math.max(Number(queryParams.page) || 1, 1);
         const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
         const search = queryParams.search?.toString() || '';
         const sort: Record<string, 1 | -1> = {};
       
     
         if (queryParams.sort) {
           for (const key in queryParams.sort) {
             const value = queryParams.sort[key];
             if (value === 'ASC' || value === '1' || value === 1) {
               sort[key] = 1;
             } else if (value === 'DESC' || value === '-1' || value === -1) {
               sort[key] = -1;
             } else {
               sort[key] = -1;
             }
           }
       ;
         } else {
           sort.createdAt = -1;
          ;
         }
       if(!decode) throwError(Messages.COMMON.UNAUTHORIZED,StatusCode.UNAUTHORIZED)
          const result = await this._userCourseService.getAllCourses(
  page,
  limit,
  search,
  queryParams.filters,
            sort,
  decode.id
);
            sendResponse(res, StatusCode.OK, Messages.COURSE.RETRIEVED, true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
    async getCategories(req: Request, res: Response): Promise<void> {
      try {
        const result=await this._userCourseService.getCategries()
        sendResponse(res,StatusCode.OK, Messages.CATEGORY.FETCHED,true,result)
      } catch (error) {
        handleControllerError(res,error)
      }
    }
    async updateUserCourse(req: Request, res: Response): Promise<void> {
        try {
          const courseId = req.params.courseId;
            const decoded = decodeToken(req.cookies.token);

            if (!decoded?.id) {
                return sendResponse(res, StatusCode.UNAUTHORIZED,  Messages.COMMON.UNAUTHORIZED, false);
            }
        
            await this._userCourseService.updateUserCourse(courseId, decoded.id);
            sendResponse(res, StatusCode.OK,  Messages.COURSE.UPDATED_WITH_USER, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
  async getProgressDetiles(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token)
      if(!decoded?.id)throwError(Messages.COMMON.UNAUTHORIZED,StatusCode.UNAUTHORIZED)
      const progress = await this._userCourseService.getProgress(decoded?.id);
      sendResponse(res,StatusCode.OK, Messages.COURSE.PROGRESS_FETCHED,true,progress)
    } catch (error) {
      handleControllerError(res,error)
    }
  }
  

}
