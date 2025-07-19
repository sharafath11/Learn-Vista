import { inject, injectable } from "inversify";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { TYPES } from "../../core/types";
import bcrypt from "bcryptjs";
import { GooglePayload, IUser } from "../../types/userTypes";
import { validateUserSignupInput } from "../../validation/userValidation";
import { IOtpRepository } from "../../core/interfaces/repositories/user/IOtpRepository";
import { generateOtp } from "../../utils/otpGenerator";
import { sendEmailOtp } from "../../utils/emailService";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum"; 

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository
  ) {}

  async registerUser(userData: IUser): Promise<Partial<IUser>> {
    const { username, email, password, role } = userData;

    validateUserSignupInput(username, email, password, role);
    const existingUser = await this.userRepository.findWithPassword({ email });
    const existOtp = await this.otpRepository.findOne({ email });

    if (!existOtp) throwError("OTP Expired", StatusCode.BAD_REQUEST);
    if (existingUser) throwError("User already exists", StatusCode.CONFLICT);

    const userToCreate = {
      ...userData,
      password: await bcrypt.hash(password, 10),
      isVerified: userData.isVerified,
    };

    return this.userRepository.create(userToCreate);
  }

  async sendOtp(email: string): Promise<void> {
    if (!email) throwError("Email is required", StatusCode.BAD_REQUEST);

    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) throwError("This email is already registered", StatusCode.CONFLICT);

    const exitOtp = await this.otpRepository.findOne({ email });
    if (exitOtp) throwError("OTP already sent", StatusCode.BAD_REQUEST);

    const otp = generateOtp();
    await this.otpRepository.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    if (!email || !otp) throwError("Email and OTP are required", StatusCode.BAD_REQUEST);

    const otpRecord = await this.otpRepository.findOne({ email, otp });
    if (!otpRecord) throwError("Invalid OTP", StatusCode.BAD_REQUEST);
  }

  async loginUser(
    email: string,
    password: string,
    googleId?: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user:  Partial<IUser>;
  }> {
  

    let user;
    
    if (googleId) {
      user = await this.userRepository.findOne({ googleId });
   
      if (!user) throwError("Invalid credentials google Id", StatusCode.BAD_REQUEST);
    } else {
      if (!email || !password) throwError("Email and password are required", StatusCode.BAD_REQUEST);
      user = await this.userRepository.findWithPassword({ email });
      if (!user) throwError("Invalid credentials ", StatusCode.BAD_REQUEST);
    }

    const userId = user?.id as string;

    if (googleId) {
      if (user.googleId !== googleId) throwError("Invalid Google account", StatusCode.BAD_REQUEST);
    } else {
      if (!user.password) throwError("Password not set for this account", StatusCode.BAD_REQUEST);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) throwError("Invalid credentials", StatusCode.BAD_REQUEST);
    }

    if (user.isBlocked) throwError("This account is blocked", StatusCode.FORBIDDEN);

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
    user:  Partial<IUser>;
  }> {
    if (!profile.email || !profile.googleId) {
      throwError("Invalid Google profile data", StatusCode.BAD_REQUEST);
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

    if (!user) return throwError("User creation/update failed", StatusCode.INTERNAL_SERVER_ERROR);
    if (user.isBlocked) throwError("This user is blocked", StatusCode.FORBIDDEN);

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
