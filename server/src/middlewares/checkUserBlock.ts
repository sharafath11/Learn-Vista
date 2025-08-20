import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/JWTtoken";
import { UserService } from "../services/user/User.service";
import container from "../core/di/container";
import { handleControllerError, sendResponse } from "../utils/ResANDError";
import { StatusCode } from "../enums/statusCode.enum";
import { Messages } from "../constants/messages";
import { TYPES } from "../core/types";
export const checkUserBlock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    const userId=decodeToken(token)?.id
      if (!userId) {
          sendResponse(res, StatusCode.UNAUTHORIZED, Messages.COMMON.UNAUTHORIZED, false);
          return 
      }  
    const userService =  container.get<UserService>(TYPES.UserService);
      const isBlocked = await userService.checkIfBlocked(userId);
    if (isBlocked) {
        sendResponse(res, StatusCode.FORBIDDEN, Messages.AUTH.BLOCKED, false);
        return 
    }
    next();
  } catch (err) {
   handleControllerError(res,err)
  }
};
