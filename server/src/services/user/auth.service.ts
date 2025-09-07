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
import { Messages } from "../../constants/messages";
import { IUserResponseUser } from "../../shared/dtos/user/user-response.dto";
import { UserMapper } from "../../shared/dtos/user/user.mapper";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private _otpRepository: IOtpRepository
  ) {}

  async registerUser(userData: IUser): Promise<IUserResponseUser> {
    const { username, email, password, role } = userData;

    validateUserSignupInput(username, email, password, role);
    const existingUser = await this._userRepository.findWithPassword({ email });
    const existOtp = await this._otpRepository.findOne({ email });

    if (!existOtp) throwError(Messages.AUTH.OTP_EXPIRED, StatusCode.BAD_REQUEST);
    if (existingUser) throwError(Messages.AUTH.USER_ALREADY_EXISTS, StatusCode.CONFLICT);

    const userToCreate = {
      ...userData,
      password: await bcrypt.hash(password, 10),
      isVerified: userData.isVerified,
    };

    const user = await this._userRepository.create(userToCreate);
    return UserMapper.toResponseUserDto(user)
  }

  async sendOtp(email: string): Promise<void> {
    if (!email) throwError(Messages.AUTH.MISSING_EMAIL, StatusCode.BAD_REQUEST);

    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) throwError(Messages.AUTH.EMAIL_ALREADY_REGISTERED, StatusCode.CONFLICT);

    const exitOtp = await this._otpRepository.findOne({ email });
    if (exitOtp) throwError(Messages.AUTH.OTP_ALREADY_SENT, StatusCode.BAD_REQUEST);

    const otp = generateOtp();
    await this._otpRepository.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    if (!email || !otp) throwError(Messages.AUTH.MISSING_EMAIL_OTP, StatusCode.BAD_REQUEST);

    const otpRecord = await this._otpRepository.findOne({ email, otp });
    if (!otpRecord) throwError(Messages.AUTH.INVALID_OTP, StatusCode.BAD_REQUEST);
  }

  async loginUser(
    email: string,
    password: string,
    googleId?: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: {id:string, role:string};
  }> {
    let user;

    if (googleId) {
      user = await this._userRepository.findOne({ googleId });

      if (!user) throwError(Messages.AUTH.INVALID_GOOGLE_CREDENTIALS, StatusCode.BAD_REQUEST);
    } else {
      if (!email || !password) throwError(Messages.AUTH.MISSING_CREDENTIALS_EMAIL_PASSWORD, StatusCode.BAD_REQUEST);
      user = await this._userRepository.findWithPassword({ email });
      if (!user) throwError(Messages.AUTH.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    const userId = user?._id.toString();

    if (googleId) {
      if (user.googleId !== googleId) throwError(Messages.AUTH.INVALID_GOOGLE_CREDENTIALS, StatusCode.BAD_REQUEST);
    } else {
      if (!user.password) throwError(Messages.AUTH.PASSWORD_NOT_SET, StatusCode.BAD_REQUEST);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throwError(Messages.AUTH.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    if (user.isBlocked) throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);

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
    user: {id:string, role:string};
  }> {
    if (!profile.email || !profile.googleId) {
      throwError(Messages.AUTH.INVALID_GOOGLE_PROFILE, StatusCode.BAD_REQUEST);
    }

    let user = await this._userRepository.findOne({ email: profile.email });

    if (!user) {
      user = await this._userRepository.create({
        username: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        profilePicture: profile?.image,
        role: "user",
        googleUser: profile.googleUser,
        isVerified: true
      });
    } else if (!user.googleUser) {
      user = await this._userRepository.update(user.id, {
        username: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        profilePicture: profile?.image,
        role: "user",
        googleUser: profile.googleUser,
        isVerified: true
      });
    }

    if (!user) return throwError(Messages.AUTH.USER_UPDATE_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    if (user.isBlocked) throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);

    const userId = user._id.toString();
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
