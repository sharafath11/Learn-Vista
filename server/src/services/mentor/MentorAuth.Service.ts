import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { TYPES } from '../../core/types';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';
import { generateOtp } from '../../utils/otpGenerator';
import { sendEmailOtp, sendPasswordResetEmail } from '../../utils/emailService';
import { IMentor } from '../../types/mentorTypes';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { throwError } from '../../utils/ResANDError';
import { validateMentorSignupInput } from '../../validation/mentorValidation';
import { StatusCode } from '../../enums/statusCode.enum';
import { INotificationService } from '../../core/interfaces/services/notifications/INotificationService';
import { notifyWithSocket } from '../../utils/notifyWithSocket';
import { Messages } from '../../constants/messages';
import { IMentorMentorResponseDto } from '../../shared/dtos/mentor/mentor-response.dto';
import { MentorMapper } from '../../shared/dtos/mentor/mentor.mapper';
import { getSignedS3Url } from '../../utils/s3Utilits';



@injectable()
export class MentorAuthService implements IMentorAuthService {
  constructor(
    @inject(TYPES.MentorRepository) private _mentorRepo: IMentorRepository,
    @inject(TYPES.MentorOtpRepository) private _mentorOtpRepo: IMentorOtpRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  async loginMentor(
    email: string,
    password: string,
  ): Promise<{ mentor: IMentorMentorResponseDto; token: string; refreshToken: string }> {
    const mentor = await this._mentorRepo.findWithPassword({ email });
    if (!mentor) throwError(Messages.AUTH.NOT_FOUND, StatusCode.NOT_FOUND);
    if (mentor.isBlock) throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);
    if (mentor.status !== "approved") throwError(Messages.AUTH.STATUS_PENDING(mentor?.status), StatusCode.FORBIDDEN);
    if (!mentor.isVerified) throwError(Messages.AUTH.PLEASE_SIGNUP, StatusCode.BAD_REQUEST);
    const isPasswordValid = await bcrypt.compare(password, mentor?.password || "");
    if (!isPasswordValid) {
      throwError(Messages.AUTH.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }
    console.log(mentor)
  
    const token = generateAccessToken(mentor._id.toString(), "mentor");
    const refreshToken = generateRefreshToken(mentor._id.toString(), "mentor");
    const signedUrl=await getSignedS3Url(mentor.profilePicture as string)
    const sendData=MentorMapper.toMentorMentorResponse(mentor,signedUrl)
    return {
      mentor:sendData,
      token,
      refreshToken,
    };
  }

  async sendOtp(email: string): Promise<void> {
    const existingMentor = await this._mentorOtpRepo.findOne({ email });
    const existMentorInmentor = await this._mentorRepo.findOne({ email, isVerified: true });
    
    if (existMentorInmentor) throwError(Messages.AUTH.ALREADY_REGISTERED, StatusCode.BAD_REQUEST);
    if (existingMentor) throwError(Messages.AUTH.OTP_ALREADY_SENT, StatusCode.BAD_REQUEST);
    
    const otp = generateOtp();
    sendEmailOtp(email, otp);
    await this._mentorOtpRepo.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await this._mentorOtpRepo.findOne({ email, otp });
    if (!otpRecord) {
      throwError(Messages.AUTH.INVALID_OTP, StatusCode.BAD_REQUEST);
    }
  }

  async mentorSignup(data: Partial<IMentor>) {
    const { isValid, errorMessage } = validateMentorSignupInput(data);
    if (!isValid) throwError(errorMessage || Messages.COMMON.INTERNAL_ERROR, StatusCode.BAD_REQUEST);
    const existMentor = await this._mentorRepo.findOne({ email: data.email });
    if (!existMentor) throwError(Messages.AUTH.APPLY_FIRST, 400);
    if (existMentor.isVerified) throwError(Messages.AUTH.ALREADY_REGISTERED, StatusCode.BAD_REQUEST);
    if (existMentor.status !== "approved") throwError(Messages.AUTH.STATUS_PENDING(existMentor.status), StatusCode.BAD_REQUEST);
  
    const hashedPassword = await bcrypt.hash(data.password!, await bcrypt.genSalt(10));
  
    const allowedUpdates: Partial<IMentor> = {
      phoneNumber: data.phoneNumber,
      experience: data.experience ? Number(data.experience) : undefined,
      bio: data.bio,
      password: hashedPassword
    };
    
    await this._mentorRepo.update(existMentor._id.toString(), { ...allowedUpdates, isVerified: true });
  }

  async forgetPassword(email: string): Promise<void> {
    const mentor = await this._mentorRepo.findOne({ email });
    if (!mentor) throwError(Messages.AUTH.NOT_FOUND, StatusCode.NOT_FOUND);
    if (!mentor.password) throwError(Messages.AUTH.CHANGE_PASSWORD_NOT_VERIFIED, StatusCode.BAD_REQUEST);

    const token = generateAccessToken(mentor.id, "mentor");
    const resetLink = `${process.env.CLIENT_URL}/mentor/reset-password/${token}`;
    
    const result = await sendPasswordResetEmail(mentor.email, resetLink);
    if (!result.success) {
      throwError(Messages.AUTH.RESET_EMAIL_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    const user = await this._mentorRepo.findById(id);
    if (!user) throwError(Messages.AUTH.NOT_FOUND, StatusCode.NOT_FOUND);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await this._mentorRepo.update(id, { password: hashedPassword });
    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [id.toString()],
      title: Messages.AUTH.PASSWORD_RESET_TITLE,
      message: Messages.AUTH.PASSWORD_RESET_MESSAGE,
      type: "info",
    });
  }
}

