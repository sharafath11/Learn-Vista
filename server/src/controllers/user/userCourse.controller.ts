import { Request, Response } from "express";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";
import { decodeToken } from "../../utils/JWTtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class UserCourseController implements IUserCourseController {
    constructor(
        @inject(TYPES.UserCourseService) private _userCourseService: IUserCourseService
    ) {}

    async getAllCourse(req: Request, res: Response): Promise<void> {
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
             if (value === 'ASC' || value === '1' || value === 1) {
               sort[key] = 1;
             } else if (value === 'DESC' || value === '-1' || value === -1) {
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
     
          const result = await this._userCourseService.getAllCourses(
  page,
  limit,
  search,
  queryParams.filters,
  sort,
);
            sendResponse(res, StatusCode.OK, "Courses Fetched", true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
    async getCategories(req: Request, res: Response): Promise<void> {
      try {
        const result=await this._userCourseService.getCategries()
        sendResponse(res,StatusCode.OK,"Fetced categrios0",true,result)
      } catch (error) {
        handleControllerError(res,error)
      }
    }
    async updateUserCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.body;
            const decoded = decodeToken(req.cookies.token);

            if (!decoded?.id) {
                return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized", false);
            }
            console.log(courseId)
            await this._userCourseService.updateUserCourse(courseId, decoded.id);
            sendResponse(res, StatusCode.OK, "Course updated with user", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
  async getProgressDetiles(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token)
      if(!decoded?.id)throwError("Unauthorized",StatusCode.UNAUTHORIZED)
      const progress = await this._userCourseService.getProgress(decoded?.id);
      sendResponse(res,StatusCode.OK,"Progress fetched succesfully",true,progress)
    } catch (error) {
      handleControllerError(res,error)
    }
  }
   async updateLessonProgress(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized", false);
      }

      // Destructure the new fields: videoWatchedDuration and videoTotalDuration
      const { 
        lessonId, 
        videoWatchedDuration, 
        videoTotalDuration, 
        theoryCompleted, 
        practicalCompleted, 
        mcqCompleted 
      } = req.body;

      if (!lessonId) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Lesson ID is required", false);
      }

      // Basic validation for video durations
      if (videoWatchedDuration !== undefined && (typeof videoWatchedDuration !== 'number' || videoWatchedDuration < 0)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Invalid videoWatchedDuration", false);
      }
      if (videoTotalDuration !== undefined && (typeof videoTotalDuration !== 'number' || videoTotalDuration <= 0)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Invalid videoTotalDuration", false);
      }
      
      // If video progress is being sent, ensure total duration is also sent
      if (videoWatchedDuration !== undefined && videoTotalDuration === undefined) {
          return sendResponse(res, StatusCode.BAD_REQUEST, "videoTotalDuration is required when updating video progress", false);
      }


      const progress = await this._userCourseService.updateLessonProgress(
        decoded.id,
        lessonId,
        {
          videoWatchedDuration, // Pass watched duration
          videoTotalDuration,   // Pass total duration
          theoryCompleted,
          practicalCompleted,
          mcqCompleted,
        }
      );

      sendResponse(res, StatusCode.OK, "Lesson progress updated", true, progress);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

}
