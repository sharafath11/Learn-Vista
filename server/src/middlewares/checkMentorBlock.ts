import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/JWTtoken";
import { handleControllerError, sendResponse } from "../utils/ResANDError";
import { StatusCode } from "../enums/statusCode.enum";
import { Messages } from "../constants/messages";
import container from "../core/di/container";
import { MentorService } from "../services/mentor/Mentor.Service";
import { TYPES } from "../core/types";

export const checkMentorBlock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    const mentorId=decodeToken(token)?.id
      if (!mentorId) {
          sendResponse(res, StatusCode.UNAUTHORIZED, Messages.COMMON.UNAUTHORIZED, false);
          return 
      }  
    const mentorService =  container.get<MentorService>(TYPES.MentorService);
      const isBlocked = await mentorService.checkIfBlocked(mentorId);
    if (isBlocked) {
        sendResponse(res, StatusCode.FORBIDDEN, Messages.AUTH.BLOCKED, false);
        return 
    }
    next();
  } catch (err) {
   handleControllerError(res,err)
  }
};
