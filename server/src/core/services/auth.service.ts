// src/core/services/auth.service.ts
import { IUser } from "../entities/user.entity";

export interface IAuthService {
  registerUser(userData: Partial<IUser>): Promise<Partial<IUser>>;
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  loginUser(
    email: string,
    password: string,
    googleId?: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<IUser>;
  }>;
  getUser(token: string): Promise<IUser>;
  googleAuth(profile: GoogleProfile): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<IUser>;
  }>;
  logout(res: Response): void;
}