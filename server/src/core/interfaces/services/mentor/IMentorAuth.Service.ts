import { Response } from 'express';
import { IMentor } from '../../../models/Mentor';


export interface IMentorAuthService {
  loginMentor(
    email: string,
    password: string,
    res: Response
  ): Promise<{ mentor: Partial<IMentor>; token: string; refreshToken: string }>;
  
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  mentorSignup(data: Partial<IMentor>): Promise<void>;
}