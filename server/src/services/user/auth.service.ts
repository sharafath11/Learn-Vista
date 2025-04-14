// src/services/user/auth.service.ts
import { inject, injectable } from "inversify";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { TYPES } from "../../core/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../types/userTypes";
import { generateTokens } from "../../utils/generateToken";
import { decodeToken } from "../../utils/tokenDecode";
import { validateUserSignupInput } from "../../utils/userValidation";
import { OtpRepository } from "../../repositories/user/OtpRepository";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: OtpRepository
  ) {}

  async registerUser(userData: IUser): Promise<Partial<IUser>> {
    const { username, email, password, role } = userData;
    
    validateUserSignupInput(username, email, password, role);
    // const user = await this.userRepository.findOne({ email });
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
    // Implement OTP sending logic
    throw new Error("Method not implemented");
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    // Implement OTP verification logic
    throw new Error("Method not implemented");
  }

  async loginUser(email: string, password: string, googleId?: string): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    const user = await this.userRepository.findOne({email})
    
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("This account is blocked");
    
    if (googleId && user.googleId === googleId) {
      const tokens = generateTokens({
        id: user._id.toString(),
        role: user.role
      });
      return {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user._id,
          role: user.role
        }
      };
    }
    console.log(user)
    if (!user.password) throw new Error("Password not set for this account");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    let userId: string;
    userId = (user._id || user.id).toString();
    const tokens = generateTokens({
      id:  userId,
      
      role: user.role
    });
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        
        role: user.role
      }
    };
  }
  async logout(): Promise<void> {
    // Implement logout logic
    throw new Error("Method not implemented");
  }

  async googleAuth(profile: any): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    let user = await this.userRepository.findOne(profile.id);
    
    if (!user) {
      user = await this.userRepository.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilePicture: profile.photos[0]?.value,
        role: "user",
        googleUser: true,
        isVerified: true
      });
    }
    
    const tokens = generateTokens({
      id: user._id.toString(),
     
      role: user.role
    });
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
      
        role: user.role
      }
    };
  }
}