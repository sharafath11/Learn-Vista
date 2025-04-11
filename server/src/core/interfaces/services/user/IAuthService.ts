// import { IUser } from "../../../types/userTypes";

import { IUser } from "../../../../types/userTypes";


export interface IAuthService {
  registerUser(userData: IUser): Promise<Partial<IUser>>;
  loginUser(email: string, password: string, googleId?: string): Promise<{ 
    token: string; 
    refreshToken: string; 
    user: any 
  }>;
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  getUser(token: string): Promise<IUser>;
  googleAuth(profile: any): Promise<any>;
  logout(): Promise<void>;
}