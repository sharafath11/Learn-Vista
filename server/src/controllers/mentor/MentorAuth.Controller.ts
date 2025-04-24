import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { clearTokens, decodeToken, setTokensInCookies } from '../../utils/JWTtoken';
import { sendResponse } from '../../utils/ResANDError';


@injectable()
export class MentorAuthController implements IMentorAuthController {
  constructor(
    @inject(TYPES.MentorAuthService) private authService: IMentorAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("andi brocamp", req.body)
      if (!req.body.email || !req.body.password) {
        res.status(400).json({ ok: false, msg: 'Email and password are required' });
        return;
      }
      const result = await this.authService.loginMentor(req.body.email, req.body.password);
      setTokensInCookies(res,result.token,result.refreshToken)
      res.status(200).json({ ok: true, msg: 'Login successful', payload: result });
    } catch (error: any) {
      console.error(error.message)
      res.status(401).json({ ok: false, msg:error.message ,role:"mentor"});
    }
  }

  async signupController(req: Request, res: Response): Promise<void> {
    try {
      
      await this.authService.mentorSignup(req.body);
      res.status(201).json({ ok: true, msg: 'Mentor created successfully' });
    } catch (error: any) {
      console.error(error.message)
      res.status(400).json({ ok: false, msg:error.message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.verifyOtp(req.body.email, req.body.otp);
      res.status(200).json({ ok: true, msg: 'Verification successful' });
    } catch (error: any) {
      res.status(400).json({ ok: false, msg:error.message });
    }
  }

  async mentorOtpControler(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.sendOtp(req.body.email);
      res.status(200).json({ ok: true, msg: 'OTP sent successfully' });
    } catch (error) {
      const err = error as Error
      console.error(err.message)
      res.status(400).json({ ok: false, msg:err.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      console.log("andi shalasf")
      clearTokens(res);
      // sendResponse(res,200,"Logout",true)
     
    } catch (error: any) {
      res.status(400).json({ ok: false, msg: 'Logout failed' });
    }
  
  }
  async forgetPassword(req: Request, res: Response): Promise<void> {
      try {
                const { email } = req.body;
                if (!email) {
                    return sendResponse(res, 400, "Email is required", false);
                }
    
                await this.authService.forgetPassword(email);
                sendResponse(res, 200, "Password reset email sent if account exists", true);
            } catch (error: any) {
                sendResponse(res, 500, error.message, false);
            }
  }
  async restartPassword(req: Request, res: Response): Promise<void> {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return sendResponse(res, 400, "Token and password are required", false);
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.id || decoded.role !== "mentor") {
            return sendResponse(res, 401, "Invalid or expired token", false);
        }

        await this.authService.resetPassword(decoded.id, password);
        sendResponse(res, 200, "Password reset successfully", true);
    } catch (error: any) {
        sendResponse(res, 500, error.message, false);
    }
}

}