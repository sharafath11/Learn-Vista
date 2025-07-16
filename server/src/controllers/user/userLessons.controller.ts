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
            const decode=decodeToken(req.cookies.token) 
            const result = await this._userLessonsService.getLessonDetils(lessonId as string,decode?.id as string);
            if (!result.videoUrl || !result.lesson || !result.questions) throwError("Somthing wront wrong", StatusCode.BAD_REQUEST);
            sendResponse(res,StatusCode.OK,"",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async getLessonReport(req: Request, res: Response): Promise<void> {
        try {
            const { lessonId, data } = req.body; 
            const decode=decodeToken(req.cookies.token)
            if (!lessonId || !data) throwError("Somthing wrnot wrong");
            const result = await this._userLessonsService.lessonReport(decode?.id as string, lessonId, data);
            sendResponse(res,StatusCode.OK,"You are subMIted succesfully",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async saveComments(req: Request, res: Response): Promise<void> {
        try {
            const { lessonId, comment } = req.body
            const decode = decodeToken(req.cookies.token)
            if(!decode) throwError("Unautherizes")
            const result=await this._userLessonsService.saveComments(decode?.id as string,lessonId, comment);
            sendResponse(res, StatusCode.OK, "Commented", true,result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
        try {
            const decoded = decodeToken(req.cookies.token);
            if (!decoded?.id) {
                return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized", false);
            }

            const {
                lessonId,
                videoWatchedDuration,
                videoTotalDuration,
                theoryCompleted,
                practicalCompleted,
                mcqCompleted,
                videoCompleted
            } = req.body;

            if (!lessonId) {
                return sendResponse(res, StatusCode.BAD_REQUEST, "Lesson ID is required", false);
            }
            if (videoWatchedDuration !== undefined && (typeof videoWatchedDuration !== 'number' || videoWatchedDuration < 0)) {
                return sendResponse(res, StatusCode.BAD_REQUEST, "Invalid videoWatchedDuration", false);
            }
            if (videoTotalDuration !== undefined && (typeof videoTotalDuration !== 'number' || videoTotalDuration <= 0)) {
                return sendResponse(res, StatusCode.BAD_REQUEST, "Invalid videoTotalDuration", false);
            }
            if (videoWatchedDuration !== undefined && videoTotalDuration === undefined) {
                return sendResponse(res, StatusCode.BAD_REQUEST, "videoTotalDuration is required when updating video progress", false);
            }
            // Add validation for other boolean fields if necessary
            // e.g., if (theoryCompleted !== undefined && typeof theoryCompleted !== 'boolean') { ... }

            const progress = await this._userLessonsService.updateLessonProgress(
                decoded.id,
                lessonId,
                {
                    videoWatchedDuration,
                    videoTotalDuration,
                    theoryCompleted,
                    practicalCompleted,
                    mcqCompleted,
                    videoCompleted
                }
            );

            sendResponse(res, StatusCode.OK, "Lesson progress updated", true, progress);
        } catch (error) {
            handleControllerError(res, error);
        }
    };
}