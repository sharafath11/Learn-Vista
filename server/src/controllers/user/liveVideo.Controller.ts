import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { Request, Response } from "express";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import {  IUserLiveController } from "../../core/interfaces/controllers/user/IUserLiveVideoController";
import { IUserLiveService } from "../../core/interfaces/services/user/IUserLiveService";

export class UserLiveCallController  implements IUserLiveController {
    constructor(
        @inject(TYPES.UserLiveService) private _userLiveService: IUserLiveService
    ) { }
    async getRoomId(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const decode = decodeToken(req.cookies.token);
            if(!decode) throwError("Invalid User",StatusCode.BAD_REQUEST)
            const result = await this._userLiveService.getRoomIdService(courseId, decode?.id as string);
            sendResponse(res,StatusCode.OK,"Joined",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }

   
}
