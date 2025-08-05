import { Request, Response } from "express";
import { IMentorStudentsController } from "../../core/interfaces/controllers/mentor/ImentorStudent.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorStudentService } from "../../core/interfaces/services/mentor/IMentorStudent.Service";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class MentorStudentsController implements IMentorStudentsController{
    constructor(
        @inject(TYPES.MentorStudentsService) private _mentorStudentService:IMentorStudentService
    ) { }
async getStudentDetilesController(req: Request, res: Response): Promise<void> {
  try {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded) {
      throwError("Invalid request", StatusCode.BAD_REQUEST);
    }

    const courseId = req.params.courseId;
    const { page = '1', limit = '8', search = '', filters = '{}', sort = '{}' } = (req.query as any).params || {};
    let parsedFilters: any = {};
    try {
      parsedFilters = typeof filters === "string" ? JSON.parse(filters) : filters;
    } catch (err) {
      console.error(" Failed to parse filters:", err);
    }

    
    let parsedSort: any = {};
    try {
      parsedSort = typeof sort === "string" ? JSON.parse(sort) : sort;
    } catch (err) {
      console.error(" Failed to parse sort:", err);
    }

    const result = await this._mentorStudentService.getStudentDetilesService(courseId, {
      page: Number(page),
      limit: Number(limit),
      search,
      status: parsedFilters?.status,
      sort: parsedSort,
    });

    sendResponse(res, StatusCode.OK, "Student data fetched successfully", true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}


    async blockStudentController(req: Request, res: Response): Promise<void> {
      try {
        const {courseId,userId,status}=req.body
           await this._mentorStudentService.studentStatusService(userId, courseId, status);
           sendResponse(res,StatusCode.OK,`Student ${status?"Blocked":"Unblock"}`,true)
       } catch (error) {
        handleControllerError(res,error)
       }
    }
}