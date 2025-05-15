import { Request, Response } from "express";
import { IMentorCourseController } from "../../core/interfaces/controllers/mentor/IMentorCourse.controller";
import { decodeToken } from "../../utils/JWTtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorCourseService } from "../../core/interfaces/services/mentor/ImentorCourse.service";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class MentorCourseController implements IMentorCourseController {
    constructor(
        @inject(TYPES.MentorCourseService) private _mentorCourseService:IMentorCourseService
    ){}
    async startLiveController(req: Request, res: Response): Promise<void> {
        try {
          const { courseId } = req.params;
          const token = req.cookies?.token;
      
          if (!courseId || !token) {
            return sendResponse(res, StatusCode.BAD_REQUEST, "Missing courseId or token", false);
          }
      
          const decoded = decodeToken(token);
          const mentorId = decoded?.id;
      
          if (!mentorId) {
            return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized access", false);
          }
      
          const liveId = await this._mentorCourseService.startLiveSession(courseId, mentorId);
      
          sendResponse(res, StatusCode.OK, "Live session started", true, { liveId });
        } catch (error) {
          handleControllerError(res, error);
        }
      }
}