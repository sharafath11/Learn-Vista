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
    console.log("🎯 Incoming Request: /course/students/:courseId");

    const decoded = decodeToken(req.cookies.token);
    console.log("🔐 Decoded Token:", decoded);

    if (!decoded) {
      console.error("🚫 Invalid token or unauthenticated access");
      throwError("Invalid request", StatusCode.BAD_REQUEST);
    }

    const courseId = req.params.courseId;
    console.log("📘 Course ID Param:", courseId);

    // ✅ Extract and parse query params from `req.query.params`
    const { page = '1', limit = '8', search = '', filters = '{}' } = (req.query as any).params || {};
    console.log("📥 Raw Query Params:", req.query);

    // ✅ Parse filters JSON string
    let parsedFilters: any = {};
    try {
      parsedFilters = typeof filters === "string" ? JSON.parse(filters) : filters;
      console.log("🧮 Parsed Filters Object:", parsedFilters);
    } catch (parseError) {
      console.error("❌ Failed to parse filters from query:", parseError);
    }

    const status = parsedFilters?.status;
    console.log("🧷 Extracted Status Filter:", status);

    console.log("🚀 Calling getStudentDetilesService with:");
    console.log({
      courseId,
      page: Number(page),
      limit: Number(limit),
      search,
      status,
    });

    const result = await this._mentorStudentService.getStudentDetilesService(
      courseId as string,
      {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        status: status as 'allowed' | 'blocked' | undefined,
      }
    );

    console.log("✅ Service Result:", result);

    sendResponse(res, StatusCode.OK, "Student data fetched successfully", true, result);
  } catch (error) {
    console.error("🔥 Controller Error:", error);
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