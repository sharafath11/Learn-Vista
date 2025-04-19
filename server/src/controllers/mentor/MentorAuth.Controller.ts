import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';


@injectable()
export class MentorAuthController implements IMentorAuthController {
  constructor(
    @inject(TYPES.MentorAuthService) private authService: IMentorAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("andi brocamp",req.body)
      const result = await this.authService.loginMentor(req.body.email, req.body.password);
      res.status(200).json({ ok: true, msg: 'Login successful', payload: result });
    } catch (error: any) {
      console.error(error.message)
      res.status(401).json({ ok: false, msg:error.message });
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
      res.status(400).json({ ok: false, msg:"Server eroor " });
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
      res.clearCookie('mentorToken');
      res.clearCookie('mentorRefreshToken');
      res.status(200).json({ ok: true, msg: 'Logged out successfully' });
    } catch (error: any) {
      res.status(400).json({ ok: false, msg: 'Logout failed' });
    }
  }
}