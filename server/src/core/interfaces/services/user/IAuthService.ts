// src/core/interfaces/services/user/IAuthService.ts

import { IUser,ISafeUser } from "../../../../types/userTypes";


export interface IAuthService {
  registerUser(userData: IUser): Promise<Partial<IUser>>;
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  loginUser(email: string, password: string, googleId?: string): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }>;
  
  logout(): Promise<void>;
  googleAuth(profile: any): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }>;
}