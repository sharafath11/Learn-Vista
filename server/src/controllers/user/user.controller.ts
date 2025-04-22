import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { Request, Response } from "express";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { sendResponse } from "../../utils/ResANDError";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const decoded = verifyAccessToken(req.cookies.token);
            const user = await this.userService.getUser(decoded?.id as string);
            if (!user) {
                res.status(404).json({ ok: false, msg: "User not found" });
                return;
            }
            sendResponse(res,200,"succes",true,user)
            return 
        } catch (error:any) {
            console.error("UserController.getUser error:", error);
            res.status(500).json({ ok: false, msg: error.message });
        }
    }
    async forgotPasword(req: Request, res: Response): Promise<void> {
         try {
             await this.userService.forgetPassword(req.body.email);
             res.status(200).json({ok:true})
         } catch (error: any) {
            console.error("UserController forget password error:", error);
            res.status(500).json({ ok: false, msg: error.message });
         }
    }
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const decoded = decodeToken(req.body.token)
            if(!decoded) sendResponse(res,404,"User not found",false)
            await this.userService.resetPassword(decoded?.id as string, req.body.password)
            sendResponse(res, 200, "Password reset", true)
            return
        } catch (error:any) {
            sendResponse(res, 500, error.message, false)
            return 
        }
    }

}