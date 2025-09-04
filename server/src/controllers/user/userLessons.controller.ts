import { Request, Response } from "express";
import { IUserLessonsController } from "../../core/interfaces/controllers/user/IUserLessonsContoller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";
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
        sendResponse(res,StatusCode.OK, Messages.LESSONS.FETCHED,true,result)
        } catch (error) {
            handleControllerError(res,error)
        }

    }
    async getQuestions(req: Request, res: Response): Promise<void> {
        try {
        const lessonId = req.params.lessonId
        if(!lessonId)throwError(Messages.COMMON.INTERNAL_ERROR,StatusCode.BAD_REQUEST)
        const result = await this._userLessonsService.getQuestions(lessonId);
        sendResponse(res, StatusCode.OK,  Messages.QUESTIONS.FETCHED, true, result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async  getAllDetilsInLesson(req: Request, res: Response): Promise<void> {
        try {
            const lessonId = req.params.lessonId
            const decode=decodeToken(req.cookies.token) 
            const result = await this._userLessonsService.getLessonDetils(lessonId as string,decode?.id as string);
            if (!result.videoUrl || !result.lesson || !result.questions) throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.BAD_REQUEST);
            sendResponse(res,StatusCode.OK,Messages.LESSONS.FETCHED_SUCCESSFULLY,true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async getLessonReport(req: Request, res: Response): Promise<void> {
        try {
            const lessonId=req.params.lessonId
            const {data } = req.body; 
            const decode=decodeToken(req.cookies.token)
            if (!lessonId || !data) throwError(Messages.COMMON.INTERNAL_ERROR);
            const result = await this._userLessonsService.lessonReport(decode?.id as string, lessonId, data);
            sendResponse(res,StatusCode.OK,Messages.LESSONS.REPORT_SUBMITTED,true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async saveComments(req: Request, res: Response): Promise<void> {
        try {
            const lessonId=req.params.lessonId
            const {comment } = req.body
            const decode = decodeToken(req.cookies.token)
            if(!decode) throwError(Messages.COMMON.UNAUTHORIZED)
            const result=await this._userLessonsService.saveComments(decode?.id as string,lessonId, comment);
            sendResponse(res, StatusCode.OK,Messages.LESSONS.COMMENT_ADDED, true,result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
        try {
            const lessonId = req.params.lessonId;
            const decoded = decodeToken(req.cookies.token);
            if (!decoded?.id) {
                return sendResponse(res, StatusCode.UNAUTHORIZED,  Messages.COMMON.UNAUTHORIZED, false);
            }

            const {
               
                videoWatchedDuration,
                videoTotalDuration,
                theoryCompleted,
                practicalCompleted,
                mcqCompleted,
                videoCompleted
            } = req.body;

            if (!lessonId) {
                return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.INVALID_ID, false);
            }
            if (videoWatchedDuration !== undefined && (typeof videoWatchedDuration !== 'number' || videoWatchedDuration < 0)) {
                return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.INVALID_VIDEO_WATCHED_DURATION, false);
            }
            if (videoTotalDuration !== undefined && (typeof videoTotalDuration !== 'number' || videoTotalDuration <= 0)) {
                return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.INVALID_VIDEO_DURATION, false);
            }
            if (videoWatchedDuration !== undefined && videoTotalDuration === undefined) {
                return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.VIDEO_TOTAL_DURATION_REQUIRED, false);
            }
            
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

            sendResponse(res, StatusCode.OK,Messages.LESSONS.PROGRESS_UPDATED, true, progress);
        } catch (error) {
            handleControllerError(res, error);
        }
    };
    async saveVoiceNote(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = req.params.lessonId;
      const { note ,courseId} = req.body;
      const decode = decodeToken(req.cookies.token);

      if (!lessonId || !note) {
        throwError(Messages.COMMON.INVALID_REQUEST, StatusCode.BAD_REQUEST);
      }

      const result = await this._userLessonsService.saveVoiceNote(
          decode?.id as string,
          courseId,
        lessonId,
        note
      );

      sendResponse(res, StatusCode.CREATED, Messages.VOICE_NOTE.SAVED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
    }
    async getVoiceNotes(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = req.params.lessonId;
      const decode = decodeToken(req.cookies.token);
      const { search = "", sort = "desc" } = req.query;

      if (!lessonId) {
        throwError(Messages.COMMON.INVALID_REQUEST, StatusCode.BAD_REQUEST);
      }

      const result = await this._userLessonsService.getVoiceNotes(
  decode?.id as string,
  "",
  lessonId,
  {
    search: search as string,
    sort: (sort as "asc" | "desc") || "desc"
  }
);

      sendResponse(res, StatusCode.OK, Messages.VOICE_NOTE.FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}