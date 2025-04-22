import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { TYPES } from "../../core/types";
import { IAuthController } from "../../core/interfaces/controllers/user/IAuthController";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { sendResponse } from "../../utils/ResANDError";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async signup(req: Request, res: Response) {
        try {
            await this.authService.registerUser(req.body);
            return sendResponse(res, 201, "User registration successful", true);
        } catch (error: any) {
            console.error(error.message);
            return sendResponse(res, 400, error.message, false);
        }
    }

    
    async googleAuth(req: Request, res: Response) {
        try {
            const result = await this.authService.googleAuth(req.body);
            
            setTokensInCookies(res, result.token, result.refreshToken);
            
            res.status(200).json({ 
                ok: true, 
                msg: "Google authentication successful",
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            });
        } catch (error: any) {
            console.log("Google auth error:", error.message);
           return sendResponse(res, 400, error.message||"google auth filed", false)
        }
    }

    async sendOtp(req: Request, res: Response) {
        try {
            await this.authService.sendOtp(req.body.email);
            sendResponse(res, 200, `OTP sent to ${req.body.email}`, true);
        } catch (error: any) {
            return sendResponse(res, 400, error.message, false);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            await this.authService.verifyOtp(req.body.email, req.body.otp);
           return sendResponse(res, 200, "Verification successful", true);
        } catch (error: any) {
            return sendResponse(res, 400, error.message, false);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password, googleId } = req.body;
            const { token, refreshToken, user } = await this.authService.loginUser(
                email, 
                password, 
                googleId
            );
            // if(!token||!refreshToken||!user) return 
            
            setTokensInCookies(res, token, refreshToken);
            return sendResponse(res, 200, "Login successful", true,  user );
        } catch (error: any) {
            console.error(error.message);
           return sendResponse(res, 401, error.message, false,);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            clearTokens(res);
         
        } catch (error: any) {
          return sendResponse(res, 500, error.message, false);
        }
    }
}

export default AuthController;