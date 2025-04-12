import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { TYPES } from "../../core/types";
import { AuthenticatedRequest } from "../../types/userTypes";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async signup(req: Request, res: Response) {
        try {
            await this.authService.registerUser(req.body);
            res.status(201).json({ ok: true, msg: "User registration successful" });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            const result = await this.authService.googleAuth(req.body);
            
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            
            res.status(200).json({ 
                ok: true, 
                msg: "Google authentication successful",
                user: result.user 
            });
        } catch (error: any) {
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
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            
            res.status(200).json({ ok: true, msg: "Login successful", user });
        } catch (error: any) {
            res.status(401).json({ ok: false, msg: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            res.status(200).json({ ok: true, msg: "Logged out successfully" });
        } catch (error: any) {
            res.status(500).json({ ok: false, msg: error.message });
        }
    }

    async getUser(req: AuthenticatedRequest, res: Response) {
        try {
          if (!req.user?.id) {
            throw new Error("User not authenticated");
          }
          
          const user = await this.authService.getUser(req.user.id);
          res.status(200).json({ ok: true, msg: "", user });
        } catch (error: any) {
          res.status(500).json({ ok: false, msg: error.message });
        }
      }
}

export default AuthController;