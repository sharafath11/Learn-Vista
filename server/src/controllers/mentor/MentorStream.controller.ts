import { Request, Response } from "express";
import { decodeToken } from "../../utils/JWTtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IMentorStreamService } from "../../core/interfaces/services/mentor/ImentorStream.service";
import { IMentorStreamController } from "../../core/interfaces/controllers/mentor/IMentorStream.controller";
import { Messages } from "../../constants/messages";
@injectable()
export class MentorStreamController implements IMentorStreamController {
    constructor(
        @inject(TYPES.MentorStreamService) private _mentorStreamService:IMentorStreamService
    ){}
    async startStreamController(req: Request, res: Response): Promise<void> {
        try {
          const { courseId } = req.params;
          const token = req.cookies?.token;
      
          if (!courseId || !token) {
            return sendResponse(res, StatusCode.BAD_REQUEST, Messages.STREAM.MISSING_STREAM_DATA, false);
          }
      
          const decoded = decodeToken(token);
          const mentorId = decoded?.id;
      
          if (!mentorId) {
            return sendResponse(res, StatusCode.UNAUTHORIZED,  Messages.COMMON.UNAUTHORIZED, false);
          }
      
          const liveId = await this._mentorStreamService.startStreamSession(courseId, mentorId);
      
          sendResponse(res, StatusCode.OK, Messages.STREAM.START_SUCCESS, true, { liveId });
        } catch (error) {
          handleControllerError(res, error);
        }
    }
    async endStreamController(req:Request,res:Response):Promise<void> {
    try {
      const { liveId } = req.params;
      const token = req.cookies?.token;
      if (!liveId || !token) {
         sendResponse(res, StatusCode.BAD_REQUEST, Messages.STREAM.MISSING_LIVE_ID, false);
      }
      const decoded = decodeToken(token);
      const mentorId = decoded?.id;
      if (!mentorId) {
        sendResponse(res, StatusCode.UNAUTHORIZED, Messages.COMMON.UNAUTHORIZED, false);
        return 
      }
      await this._mentorStreamService.endStream(liveId,mentorId);
      sendResponse(res, StatusCode.OK,Messages.STREAM.END_SUCCESS(), true, { liveId });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}