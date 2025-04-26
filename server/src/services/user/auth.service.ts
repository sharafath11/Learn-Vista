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
import { throwError } from "../../utils/ResANDError";


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
    
    if(!existOtp) throwError("OTP Expired", 400);
    if (existingUser) throwError("User already exists", 409);
    
    const userToCreate = {
      ...userData,
      password: await bcrypt.hash(password, 10),
      isVerified: userData.isVerified,
    };
    
    return this.userRepository.create(userToCreate);
  }

  async sendOtp(email: string): Promise<void> {
    if (!email) throwError("Email is required", 400);
    
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) throwError("This email is already registered", 409);
    
    const exitOtp = await this.otpRepository.findOne({ email });
    if(exitOtp) throwError("OTP already sent", 400);
    
    const otp = generateOtp();
    await this.otpRepository.create({ 
      email, 
      otp, 
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    if (!email || !otp) throwError("Email and OTP are required", 400);
    
    const otpRecord = await this.otpRepository.findOne({ email, otp });
    if (!otpRecord) throwError("Invalid OTP", 400);
  }

  async loginUser(
    email: string, 
    password: string, 
    googleId?: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    let user;
    if (googleId) {
      user = await this.userRepository.findOne({googleId});
      if (!user) throwError("Invalid credentiols", 400);
    } else {
      if (!email || !password) throwError("Email and password are required", 400);
      user = await this.userRepository.findOne({email});
      if (!user) throwError("Invalid credentiols", 400);
    }

    const userId = user?.id as string;
    
    if (googleId) {
      if (user.googleId !== googleId) throwError("Invalid Google account",400);
    } else {
      if (!user.password) throwError("Password not set for this account", 400);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throwError("Invalid credentials", 400);
    }

    if (user.isBlocked) throwError("This account is blocked", 403);
    
    const token = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);
    
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
    if (!profile.email || !profile.googleId) {
      throwError("Invalid Google profile data", 400);
    }
    
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

    if (!user) return throwError("User creation/update failed", 500);
    if (user.isBlocked) throwError("This user is blocked", 403);
    
    const userId = user.id as string;
    const token = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);
  
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        role: user.role
      }
    };
  }
}