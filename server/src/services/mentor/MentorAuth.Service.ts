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

@injectable()
export class MentorAuthService implements IMentorAuthService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.MentorOtpRepository) private mentorOtpRepo: IMentorOtpRepository,
    @inject(TYPES.NotificationService) private _notificationService:INotificationService
  ) {}

  async loginMentor(
    email: string,
    password: string,
  ): Promise<{ mentor: Partial<IMentor>; token: string; refreshToken: string }> {
    const mentor = await this.mentorRepo.findWithPassword({ email });
    if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
    if (mentor.isBlock) throwError("This account is blocked", StatusCode.FORBIDDEN);
    if (mentor.status !== "approved") throwError(`This user is ${mentor?.status}`, StatusCode.FORBIDDEN);
    if (!mentor.isVerified) throwError("Please signup", StatusCode.BAD_REQUEST);
    const isPasswordValid = await bcrypt.compare(password, mentor?.password || "");
    if (!isPasswordValid) {
      throwError("Invalid email or password", StatusCode.BAD_REQUEST);
    }
  
    const token = generateAccessToken(mentor.id, "mentor");
    const refreshToken = generateRefreshToken(mentor.id, "mentor");
  
    return {
      mentor: {
        id: mentor.id,
        username: mentor.username,
        email: mentor.email,
        expertise: mentor.expertise,
        experience: mentor.experience,
        bio: mentor.bio,
        phoneNumber: mentor?.phoneNumber || "",
        socialLinks: mentor.socialLinks,
        liveClasses: mentor.liveClasses,
        coursesCreated: mentor.coursesCreated,
        reviews: mentor.reviews,
        profilePicture: mentor.profilePicture
      },
      token,
      refreshToken,
    };
  }

  async sendOtp(email: string): Promise<void> {
    const existingMentor = await this.mentorOtpRepo.findOne({ email });
    const existMentorInmentor = await this.mentorRepo.findOne({ email, isVerified: true });
    
    if (existMentorInmentor) throwError("This mentor is already registered",  StatusCode.BAD_REQUEST);
    if (existingMentor) throwError("OTP already sent", StatusCode.BAD_REQUEST);
    
    const otp = generateOtp();
    sendEmailOtp(email, otp);
    await this.mentorOtpRepo.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await this.mentorOtpRepo.findOne({ email, otp });
    if (!otpRecord) {
      throwError("Invalid OTP",  StatusCode.BAD_REQUEST);
    }
  }

  async mentorSignup(data: Partial<IMentor>) {
    const { isValid, errorMessage } = validateMentorSignupInput(data);
    if (!isValid) throwError(errorMessage || "Unknown error occurred during validation", StatusCode.BAD_REQUEST);
    const existMentor = await this.mentorRepo.findOne({ email: data.email });
    if (!existMentor) throwError("Please apply to be a mentor", 400);
    if (existMentor.isVerified) throwError("This mentor is already registered", StatusCode.BAD_REQUEST);
    if (existMentor.status !== "approved") throwError(`This request is ${existMentor.status}`, StatusCode.BAD_REQUEST);
  
    const hashedPassword = await bcrypt.hash(data.password!, await bcrypt.genSalt(10));
  
    const allowedUpdates: Partial<IMentor> = {
      phoneNumber: data.phoneNumber,
      experience: data.experience ? Number(data.experience) : undefined,
      bio: data.bio,
      password: hashedPassword
    };
    
    await this.mentorRepo.update(existMentor.id, { ...allowedUpdates, isVerified: true });
  }

  async forgetPassword(email: string): Promise<void> {
    const mentor = await this.mentorRepo.findOne({ email });
    if (!mentor) throwError("User not found", StatusCode.NOT_FOUND);
    if(!mentor.password) throwError ("Please Register then you can change password",StatusCode.BAD_REQUEST)

    const token = generateAccessToken(mentor.id, "mentor");
    const resetLink = `${process.env.CLIENT_URL}/mentor/reset-password/${token}`;
    
    const result = await sendPasswordResetEmail(mentor.email, resetLink);
    if (!result.success) {
      throwError("Failed to send reset email. Try again later.",  StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    const user = await this.mentorRepo.findById(id);
    if (!user) throwError("Mentor not found",  StatusCode.NOT_FOUND);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.mentorRepo.update(id, { password: hashedPassword });
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id.toString()],
    title: " Password Reset",
    message: "Your password has been reset.",
    type: "info",
  });
  }
}
