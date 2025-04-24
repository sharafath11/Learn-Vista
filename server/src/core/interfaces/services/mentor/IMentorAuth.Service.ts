import { Response } from 'express';
import { IMentor } from '../../../../types/mentorTypes';



export interface IMentorAuthService {
  loginMentor(
    email: string,
    password: string,
  ): Promise<{ mentor: Partial<IMentor>; token: string; refreshToken: string }>;
  
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  mentorSignup(data: Partial<IMentor>): Promise<void>;
  forgetPassword(email: string): Promise<void>
  resetPassword(id:string,password:string):Promise<void>
}