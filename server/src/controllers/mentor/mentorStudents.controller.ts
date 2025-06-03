import { Request, Response } from "express";
import { IMentorStudentsController } from "../../core/interfaces/controllers/mentor/ImentorStudent.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorStudentService } from "../../core/interfaces/services/mentor/IMentorStudent.Service";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class MentorStudentsController implements IMentorStudentsController{
    constructor(
        @inject(TYPES.MentorStudentsService) private _mentorStudentService:IMentorStudentService
    ) { }
    async getStudentDetilesController(req: Request, res: Response): Promise<void> {
        try {
            const decoded = decodeToken(req.cookies.token);
            const courseId=req.params.courseId
            if(!decoded)throwError("Invalid request",StatusCode.BAD_REQUEST)
            const result = await this._mentorStudentService.getStudentDetilesService(courseId as string);
            sendResponse(res,StatusCode.OK,"Student data fetched succesfully",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async blockStudentController(req: Request, res: Response): Promise<void> {
       try {
         const {userId,status}=req.body
        const courseId=req.params.courseId
        await this._mentorStudentService.studentStatusService(userId,courseId,status)
       } catch (error) {
        handleControllerError(res,error)
       }
    }
}