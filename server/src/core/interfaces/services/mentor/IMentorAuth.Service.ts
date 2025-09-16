import { IMentor } from '../../../../types/mentorTypes';
import { IMentorMentorResponseDto, IMentorResponseDto } from '../../../../shared/dtos/mentor/mentor-response.dto';



export interface IMentorAuthService {
  loginMentor(
    email: string,
    password: string,
  ): Promise<{ mentor: IMentorMentorResponseDto; token: string; refreshToken: string }>;
  
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  mentorSignup(data: Partial<IMentorResponseDto>): Promise<void>;
  forgetPassword(email: string): Promise<void>
  resetPassword(id:string,password:string):Promise<void>
}