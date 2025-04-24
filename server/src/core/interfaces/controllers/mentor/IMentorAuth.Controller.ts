import { Request, Response } from 'express';

export interface IMentorAuthController {
  login(req: Request, res: Response): Promise<void>;
  signupController(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  mentorOtpControler(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  forgetPassword(req: Request, res: Response): void
  restartPassword(req:Request,res:Response):void
}