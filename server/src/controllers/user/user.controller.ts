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
            if (!decoded?.id) {
                return sendResponse(res, 401, "Unauthorized - Invalid token", false);
            }

            const user = await this.userService.getUser(decoded.id);
            if (!user) {
                return sendResponse(res, 404, "User not found", false);
            }

            sendResponse(res, 200, "User retrieved successfully", true, user);
        } catch (error: any) {
            sendResponse(res, 500, error.message, false);
        }
    }

    async forgotPasword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                return sendResponse(res, 400, "Email is required", false);
            }

            await this.userService.forgetPassword(email);
            sendResponse(res, 200, "Password reset email sent if account exists", true);
        } catch (error: any) {
            sendResponse(res, 500, error.message, false);
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, password } = req.body;
            
            if (!token || !password) {
                return sendResponse(res, 400, "Token and password are required", false);
            }

            const decoded = decodeToken(token);
            if (!decoded?.id) {
                return sendResponse(res, 401, "Invalid or expired token", false);
                
            }

            await this.userService.resetPassword(decoded.id, password);
            sendResponse(res, 200, "Password reset successfully", true);
        } catch (error: any) {
            sendResponse(res, 500, error.message, false);
        }
    }
}