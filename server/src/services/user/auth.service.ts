// src/services/user/auth.service.ts
import { inject, injectable } from "inversify";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { TYPES } from "../../core/types";
import bcrypt from "bcryptjs";
import { GooglePayload, IUser } from "../../types/userTypes";

import { validateUserSignupInput } from "../../utils/userValidation";
import { OtpRepository } from "../../repositories/user/OtpRepository";
import { generateOtp } from "../../utils/otpGenerator";
import { sendEmailOtp } from "../../utils/emailService";
import { IOtpRepository } from "../../core/interfaces/repositories/user/IOtpRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository
  ) {}

  async registerUser(userData: IUser): Promise<Partial<IUser>> {
    const { username, email, password, role } = userData;
    
    validateUserSignupInput(username, email, password, role);
    const existingUser = await this.userRepository.findOne({email});
    const existOtp = await this.otpRepository.findOne({ email });
    
    if(!existOtp) throw new Error("OTP Expired");
    if (existingUser) throw new Error("User already exists");
    
    userData.password = await bcrypt.hash(userData.password, 10);
    const userToCreate = {
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
      isVerified: userData.isVerified,
      
    };
    
    return this.userRepository.create(userToCreate);
  }

  async sendOtp(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) throw new Error("This email is already registered");
    const exitOtp = await this.otpRepository.findOne({ email })
    if(exitOtp) throw new Error("OTP already send it")
    const otp = generateOtp();
    await this.otpRepository.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await this.otpRepository.findOne({ email, otp });
   if (!otpRecord) throw new Error("Invalid OTP");
  }

  async loginUser(email: string, password: string, googleId?: string): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    let user
    if (googleId) {
      user=await this.userRepository.findOne({googleId})
    } else {
      user = await this.userRepository.findOne({email})
    }
    let userId=user?.id as string
    
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("This account is blocked");
    
    if (googleId && user.googleId === googleId) {
      
      const token = generateAccessToken(
         userId,
         user.role
      );
      const refreshToken=generateRefreshToken(userId,user.role)
      return {
        token,
        refreshToken,
        user: {
          id: userId,
          role: user.role
        }
      };
    }
   
    if (!user.password) throw new Error("Password not set for this account");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    
    const token = generateAccessToken(
      userId,
      user.role
   );
   const refreshToken=generateRefreshToken(userId,user.role)
    return {
      token,
      refreshToken,
      user: {
        id: userId,
        
        role: user.role
      }
    };
  }


  async googleAuth(profile: GooglePayload): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    
    let user = await this.userRepository.findOne({ email: profile.email });
    if (!user) {
      user = await this.userRepository.create({
        username: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        profilePicture: profile?.image,
        role: "user",
        googleUser: profile.googleUser,
        isVerified: true
      });
    } else if (!user.googleUser) {
      user = await this.userRepository.update(user.id, {
        username: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        profilePicture: profile?.image,
        role: "user",
        googleUser: profile.googleUser,
        isVerified: true
      });
    }
    if (!user) {
      throw new Error("User creation/update failed");
    }
    const userId = user.id as string
    
    const token = generateAccessToken(
      userId,
      user.role
   );
   const refreshToken=generateRefreshToken(userId,user.role)
  
    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        role: user.role
      }
    };
  }
}