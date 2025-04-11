import { Request, Response } from "express";

export interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  getUser(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
}