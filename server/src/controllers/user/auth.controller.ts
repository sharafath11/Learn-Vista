import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { TYPES } from "../../core/types";
import { IAuthController } from "../../core/interfaces/controllers/user/IAuthController";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private _authService: IAuthService
    ) {}

    async signup(req: Request, res: Response) {
        try {
            if (!req.body) throwError(Messages.AUTH.MISSING_BODY, StatusCode.BAD_REQUEST);
            await this._authService.registerUser(req.body);
            return sendResponse(res, StatusCode.CREATED, Messages.AUTH.REGISTRATION_SUCCESS, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            if (!req.body) throwError(Messages.AUTH.MISSING_BODY, 400);
            const result = await this._authService.googleAuth(req.body);
            setTokensInCookies(res, result.token, result.refreshToken);
            res.status(StatusCode.OK).json({ 
                ok: true, 
                msg: Messages.AUTH.GOOGLE_AUTH_SUCCESS,
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
            if (!req.body.email) throwError(Messages.AUTH.MISSING_EMAIL, StatusCode.BAD_REQUEST);
            await this._authService.sendOtp(req.body.email);
            sendResponse(res, StatusCode.CREATED, Messages.AUTH.OTP_SENT, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            if (!req.body.email || !req.body.otp) throwError(Messages.AUTH.MISSING_EMAIL, 400);
            await this._authService.verifyOtp(req.body.email, req.body.otp);
            return sendResponse(res, StatusCode.CREATED, Messages.AUTH.VERIFICATION_SUCCESS, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

async login(req: Request, res: Response) {
    try {
        const { email, password, googleId } = req.body;
        if ((!email || !password) && !googleId) {
            throwError(Messages.AUTH.MISSING_CREDENTIALS, StatusCode.BAD_REQUEST);
        }

        const { token, refreshToken, user } = await this._authService.loginUser(
            email, 
            password, 
            googleId
        );

        setTokensInCookies(res, token, refreshToken);

        return sendResponse(res, StatusCode.OK, Messages.AUTH.LOGIN_SUCCESS, true, user);
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