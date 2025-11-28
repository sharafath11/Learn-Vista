import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUser.controller";
import { Request, Response } from "express";
import { decodeToken, verifyAccessToken } from "../../utils/jwtToken";
import { handleControllerError, sendResponse, throwError } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { pscPrompt } from "../../utils/rportprompt";
import { getAIResponse } from "../../config/gemaniAi";
import { Messages } from "../../constants/messages";
import { cache } from "../../lib/chache";
import { extractJSON } from "../../utils/extractJSON";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private _userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const decoded = verifyAccessToken(req.cookies.token);
            if (!decoded?.id) {
                throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
            }

            const user = await this._userService.getUser(decoded.id);
            if (!user) {
                throwError(Messages.USERS.USER_NOT_FOUND, StatusCode.NOT_FOUND);
            }
         
            sendResponse(res, StatusCode.OK, Messages.USERS.FETCHED, true, user);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async forgotPasword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                throwError(Messages.USERS.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
            }

            await this._userService.forgetPassword(email);
            sendResponse(res, StatusCode.OK,Messages.AUTH.FORGOT_PASSWORD_SUCCESS, true);
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
                    Messages.AUTH.WEAK_PASSWORD,
                    false
                );
                return;
            }

            if (!token || !password) {
                throwError(Messages.USERS.MISSING_TOKEN_PASSWORD, StatusCode.BAD_REQUEST);
            }

            const decoded = decodeToken(token);
            if (!decoded?.id) {
                throwError(Messages.AUTH.INVALID_TOKEN, StatusCode.UNAUTHORIZED);
            }

            await this._userService.resetPassword(decoded.id, password);
            sendResponse(res, StatusCode.OK, Messages.AUTH.PASSWORD_RESET_SUCCESS, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

 async getQuestionByNumber(req: Request, res: Response): Promise<void> {
  try {
    const number = parseInt(req.query.number as string);

    if (isNaN(number)) {
      return sendResponse(
        res,
        StatusCode.BAD_REQUEST,
        Messages.USERS.INVALID_QUESTION_NUMBER,
        false
      );
    }
    const correctKey = `psc_correct_answer_${number}`;
    const explanationKey = `psc_explanation_${number}`;
    const prompt = pscPrompt(number);
    const aiRaw = await getAIResponse(prompt);
    const parsed = extractJSON(aiRaw);
    if (!parsed ||typeof parsed.correctAnswer !== "number" ||!Array.isArray(parsed.options)) {
      throwError("Invalid AI response structure");
    }
    cache.set(correctKey, parsed.correctAnswer);
    cache.set(explanationKey, parsed.explanation);
    const { correctAnswer, explanation, ...frontendData } = parsed;
    return sendResponse(res, StatusCode.OK, "", true, frontendData);

  } catch (error) {
    handleControllerError(res, error);
  }
}
  async checkPSCAnswer(req: Request, res: Response): Promise<void>{
   try {
    const { questionId, selectedOption } = req.body;

    const correctKey = `psc_correct_answer_${questionId}`;
    const explanationKey = `psc_explanation_${questionId}`;

    const correctAnswer = cache.get<number>(correctKey);
    const explanation = cache.get<string>(explanationKey);

    if (correctAnswer === undefined) {
      return sendResponse(res, 400, "Answer not found", false);
    }

    const isCorrect = selectedOption === correctAnswer;

    return sendResponse(res, 200, "", true, {
      isCorrect,
      correctAnswer,
      explanation,
    });

  } catch (err) {
    handleControllerError(res, err);
  }
 }
  async getDailyTask(req: Request, res: Response): Promise<void> {
      try {
          const decoded = decodeToken(req.cookies.token);
          if (!decoded?.id) throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
          const result=await this._userService.getDailyTaskSevice(decoded.id)
    sendResponse(res, StatusCode.OK,  Messages.USERS.DAILY_TASKS_GENERATED, true, result);
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
      throwError(Messages.COMMON.MISSING_FIELDS, StatusCode.BAD_REQUEST);
    }

    const result = await this._userService.updateDailyTask({
  taskId,
  taskType,
  answer,
  audioFile,
});

    sendResponse(res, StatusCode.OK, Messages.USERS.TASK_UPDATED, true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}
    async getAllDailyTask(req: Request, res: Response): Promise<void> {
        try {
            const decoded = decodeToken(req.cookies.token);
            if (!decoded?.id) throwError(Messages.COMMON.UNAUTHORIZED);
            const result = await this._userService.getAllDailyTasks(decoded?.id as string);
            sendResponse(res,StatusCode.OK, Messages.USERS.ALL_DAILY_TASKS_FETCHED,true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }


}
