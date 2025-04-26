import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { Request, Response } from "express";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const decoded = verifyAccessToken(req.cookies.token);
            if (!decoded?.id) {
                throwError("Unauthorized - Invalid token", 401);
            }

            const user = await this.userService.getUser(decoded.id);
            if (!user) {
                throwError("User not found", 404);
            }

            sendResponse(res, 200, "User retrieved successfully", true, user);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async forgotPasword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                throwError("Email is required", 400);
            }

            await this.userService.forgetPassword(email);
            sendResponse(res, 200, "Password reset email sent if account exists", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, password } = req.body;
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!password || !strongPasswordRegex.test(password)) sendResponse(res,403,"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",false)
            if (!token || !password) {
                throwError("Token and password are required", 400);
            }

            const decoded = decodeToken(token);
            if (!decoded?.id) {
                throwError("Invalid or expired token", 401);
            }

            await this.userService.resetPassword(decoded.id, password);
            sendResponse(res, 200, "Password reset successfully", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
}