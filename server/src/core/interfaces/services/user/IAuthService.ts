// src/core/interfaces/services/user/IAuthService.ts

import { IUserResponseUser } from "../../../../shared/dtos/user/user-response.dto";
import { IUser } from "../../../../types/userTypes";


export interface IAuthService {
  registerUser(userData: IUser): Promise<IUserResponseUser>;
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  loginUser(email: string, password: string, googleId?: string): Promise<{
    token: string;
    refreshToken: string;
    user: {id:string,role:string};
  }>;
  googleAuth(profile: any): Promise<{
    token: string;
    refreshToken: string;
    user: {id:string, role:string};
  }>;
}