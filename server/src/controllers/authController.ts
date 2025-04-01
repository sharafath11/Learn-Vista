import { Request, Response } from "express";
import authService from "../services/user/authService";
import { AuthenticatedRequest } from "../types/userTypes";

class AuthController {
    async signup(req: Request, res: Response) {
        try {
            await authService.registerUser(req.body);
            res.status(201).json({ ok: true, msg: "User registration successful" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async sendOtp(req: Request, res: Response) {
        try {
            await authService.sendOtp(req.body.email);
            res.status(200).json({ ok: true, msg: `OTP sent to ${req.body.email}` });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            await authService.verifyOtp(req.body.email, req.body.otp);
            res.status(200).json({ ok: true, msg: "Verification successful" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            await authService.loginUser(req.body.email, req.body.password, res);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }
    logout (req: Request, res: Response) {
       try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(200).json({ ok: true, msg: "Logged out successfully" });
       } catch (error) {
       this.handleError(res,error)
       }
      }


    async getUser(req: AuthenticatedRequest, res: Response) {
        
        try {
            
            if (!req.cookies.token) {
                throw new Error("User not valid");
            }
        
            
            const user = await authService.getUser(req.cookies.token);
            res.status(200).json({ok:true,msg:"",user});
        } catch (error: any) {
            res.status(500).json({ msg: error.message });
        }
    }

    private handleError(res: Response, error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
}

export default new AuthController();
