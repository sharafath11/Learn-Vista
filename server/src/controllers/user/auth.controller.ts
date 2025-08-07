import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { TYPES } from "../../core/types";
import { IAuthController } from "../../core/interfaces/controllers/user/IAuthController";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
// import { sendResponse, handleControllerError, throwError } from "../../utils/errorUtils";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async signup(req: Request, res: Response) {
        try {
            if (!req.body) throwError("Request body is missing", StatusCode.BAD_REQUEST);
            await this.authService.registerUser(req.body);
            return sendResponse(res, StatusCode.CREATED, "User registration successful", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            if (!req.body) throwError("Request body is missing", 400);
            const result = await this.authService.googleAuth(req.body);
            setTokensInCookies(res, result.token, result.refreshToken);
            res.status(StatusCode.OK).json({ 
                ok: true, 
                msg: "Google authentication successful",
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            });
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async sendOtp(req: Request, res: Response) {
        try {
            if (!req.body.email) throwError("Email is required", StatusCode.BAD_REQUEST);
            await this.authService.sendOtp(req.body.email);
            sendResponse(res, StatusCode.CREATED, `OTP sent to ${req.body.email}`, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            if (!req.body.email || !req.body.otp) throwError("Email and OTP are required", 400);
            await this.authService.verifyOtp(req.body.email, req.body.otp);
            return sendResponse(res, StatusCode.CREATED, "Verification successful", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

async login(req: Request, res: Response) {
    try {
        const { email, password, googleId } = req.body;

        // Require either email/password OR Google ID
        if ((!email || !password) && !googleId) {
            throwError("Provide email/password or Google ID", StatusCode.BAD_REQUEST);
        }

        const { token, refreshToken, user } = await this.authService.loginUser(
            email, 
            password, 
            googleId
        );

        setTokensInCookies(res, token, refreshToken);

        return sendResponse(res, StatusCode.OK, "Login successful", true, user);
    } catch (error) {
        handleControllerError(res, error);
    }
}

    async logout(req: Request, res: Response) {
        try {
            clearTokens(res);
           
        } catch (error) {
            handleControllerError(res, error);
        }
    }
}

export default AuthController;