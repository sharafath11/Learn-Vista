import { Request, Response } from "express";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";
import { decodeToken } from "../../utils/JWTtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class UserCourseController implements IUserCourseController {
    constructor(
        @inject(TYPES.UserCourseService) private _userCourseService: IUserCourseService
    ) {}

    async getAllCourse(req: Request, res: Response): Promise<void> {
        try {
            const result = await this._userCourseService.getAllCourses();
            sendResponse(res, StatusCode.OK, "Courses Fetched", true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async updateUserCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.body;
            const decoded = decodeToken(req.cookies.token);

            if (!decoded?.id) {
                return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized", false);
            }

            await this._userCourseService.updateUserCourse(courseId, decoded.id);
            sendResponse(res, StatusCode.OK, "Course updated with user", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
}
