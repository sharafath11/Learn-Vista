import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { TYPES } from "../../core/types";
import { IAuthController } from "../../core/interfaces/controllers/user/IAuthController";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";

@injectable()
export class AuthController implements IAuthController{
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async signup(req: Request, res: Response) {
        try {

            
            await this.authService.registerUser(req.body);
            res.status(201).json({ ok: true, msg: "User registration successful" });
        } catch (error: any) {
            console.error(error.message)
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            
            const result = await this.authService.googleAuth(req.body);
            
            setTokensInCookies(res,result.token,result.refreshToken)
            
            res.status(200).json({ 
                ok: true, 
                msg: "Google authentication successful",
                user: result.user,
                token: result.token,
                refreshToken:result.refreshToken
            });
            
        } catch (error: any) {
            console.log("succee)_")
            console.log(error.message)
            res.status(500).json({ 
                ok: false, 
                msg: error.message || "Google authentication failed" 
            });
        }
    }

    async sendOtp(req: Request, res: Response) {
        try {
            await this.authService.sendOtp(req.body.email);
            res.status(200).json({ ok: true, msg: `OTP sent to ${req.body.email}` });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            await this.authService.verifyOtp(req.body.email, req.body.otp);
            res.status(200).json({ ok: true, msg: "Verification successful" });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
          
            const { email, password, googleId } = req.body;
            const { token, refreshToken, user } = await this.authService.loginUser(email, password, googleId);
            
            setTokensInCookies(res,token,refreshToken)
            
            res.status(200).json({ ok: true, msg: "Login successful", user });
        } catch (error: any) {
            console.error(error.message)
            res.status(401).json({ ok: false, msg: error.message,role:"user" });
        }
    }
    async logout(req: Request, res: Response) {
        try {
            clearTokens(res);
                   
        } catch (error: any) {
            res.status(500).json({ ok: false, msg: error.message });
        }
    }
}

export default AuthController;