import { Request, Response } from "express";
import { IUserLessonsController } from "../../core/interfaces/controllers/user/IUserLessonsContoller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class UserLessonsController implements IUserLessonsController{
    constructor(
        @inject(TYPES.UserLessonsService) private _userLessonsService :IUserLessonsService
    ) { }
    async getLessons(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.params.courseId;
            
        const decode=decodeToken(req.cookies.token)
        const result = await this._userLessonsService.getLessons(courseId, decode?.id as string);
        sendResponse(res,StatusCode.OK,"",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }

    }
    async getQuestions(req: Request, res: Response): Promise<void> {
        try {
        const lessonId = req.params.lessonId
        if(!lessonId)throwError("Somthing wront wrong",StatusCode.BAD_REQUEST)
        const result = await this._userLessonsService.getQuestions(lessonId);
        sendResponse(res, StatusCode.OK, "", true, result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async  getAllDetilsInLesson(req: Request, res: Response): Promise<void> {
        try {
            const lessonId = req.body.lessonId
            const result = await this._userLessonsService.getLessonDetils(lessonId as string);
            if (!result.videoUrl || !result.lesson || !result.questions) throwError("Somthing wront wrong", StatusCode.BAD_REQUEST);
            sendResponse(res,StatusCode.OK,"",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
}