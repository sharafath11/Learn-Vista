import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { Request, Response } from "express";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { pscPrompt } from "../../utils/Rportprompt";
import { getGemaniResponse } from "../../config/gemaniAi";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const decoded = verifyAccessToken(req.cookies.token);
            if (!decoded?.id) {
                throwError("Unauthorized - Invalid token", StatusCode.UNAUTHORIZED);
            }

            const user = await this.userService.getUser(decoded.id);
            if (!user) {
                throwError("User not found", StatusCode.NOT_FOUND);
            }
         
            sendResponse(res, StatusCode.OK, "User retrieved successfully", true, user);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async forgotPasword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                throwError("Email is required", StatusCode.BAD_REQUEST);
            }

            await this.userService.forgetPassword(email);
            sendResponse(res, StatusCode.OK, "Password reset email sent if account exists", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, password } = req.body;
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

            if (!password || !strongPasswordRegex.test(password)) {
                sendResponse(
                    res,
                    StatusCode.FORBIDDEN,
                    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
                    false
                );
                return;
            }

            if (!token || !password) {
                throwError("Token and password are required", StatusCode.BAD_REQUEST);
            }

            const decoded = decodeToken(token);
            if (!decoded?.id) {
                throwError("Invalid or expired token", StatusCode.UNAUTHORIZED);
            }

            await this.userService.resetPassword(decoded.id, password);
            sendResponse(res, StatusCode.OK, "Password reset successfully", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

  async getQuestionByNumber(req: Request, res: Response): Promise<void> {
    try {
        const number = parseInt(req.query.number as string);
     
      if (isNaN(number)) {
        res.status(400).json({ ok: false, msg: "Invalid question number" });
        return;
      }
        const prompot=pscPrompt(number)
        const answer = await getGemaniResponse(prompot);
      
        sendResponse(res, StatusCode.OK, "", true, answer);
    } catch (error) {
     handleControllerError(res,error)
    }
      
  
  }
  async getDailyTask(req: Request, res: Response): Promise<void> {
      try {
          const decoded = decodeToken(req.cookies.token);
          if (!decoded?.id) throwError("unautheized", StatusCode.UNAUTHORIZED);
          const result=await this.userService.getDailyTaskSevice(decoded.id)
    sendResponse(res, StatusCode.OK, "Daily tasks generated", true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
  }
async updateDailyTask(req: Request, res: Response): Promise<void> {
  try {
    const { taskId, taskType } = req.body;
    const audioFile = req.file; 
    const answer = req.body.answer; 

    if (!taskId || !taskType) {
      throwError("Missing required fields", StatusCode.BAD_REQUEST);
    }

    const result = await this.userService.updateDailyTask({
  taskId,
  taskType,
  answer,
  audioFile,
});

    sendResponse(res, StatusCode.OK, "Task updated", true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}
    async getAllDailyTask(req: Request, res: Response): Promise<void> {
        try {
            const decoded = decodeToken(req.cookies.token);
            if (!decoded?.id) throwError("unauthrized");
            const result = await this.userService.getAllDailyTasks(decoded?.id as string);
            sendResponse(res,StatusCode.OK,"fetched all daily task ",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }


}
