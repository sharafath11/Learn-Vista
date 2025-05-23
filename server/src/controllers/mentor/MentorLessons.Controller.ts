import { inject, injectable } from "inversify";
import { IMentorLessonsController } from "../../core/interfaces/controllers/mentor/IMentorLesson.Controller";
import { TYPES } from "../../core/types";
import { Request, Response } from "express";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class MentorLessonsController implements IMentorLessonsController{
    constructor(
        @inject(TYPES.MentorLessonsService) private _mentorLessonsSerive:IMentorLessonService
    ) { }
    async getLessons(req: Request, res: Response): Promise<void> {
        try {
            const {courseId}=req.params
            const result = await this._mentorLessonsSerive.getLessons(courseId);
            sendResponse(res, StatusCode.OK, "", true, result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
}