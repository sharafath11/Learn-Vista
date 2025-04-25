import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';

import { generateOtp } from '../../utils/otpGenerator';
import { sendEmailOtp, sendPasswordResetEmail } from '../../utils/emailService';
import { IMentor, SafeMentor } from '../../types/mentorTypes';
import { validateMentorSignupInput } from '../../utils/mentorValidation';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { throwError } from '../../utils/ResANDError';

@injectable()
export class MentorAuthService implements IMentorAuthService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.MentorOtpRepository) private mentorOtpRepo: IMentorOtpRepository
  ) {}

  async loginMentor(
    email: string,
    password: string,
  ): Promise<{ mentor: any; token: string; refreshToken: string }> {
    const mentor = await this.mentorRepo.findOne({ email });
    
    if (mentor?.isBlock) throwError("This account is blocked", 403);
    if (mentor?.status !== "approved") throwError(`This user is ${mentor?.status}`, 403);
    if (!mentor) throwError("Mentor not found", 404);
    if (!mentor.isVerified) throwError("Please signup", 401);
    
    const isPasswordValid = await bcrypt.compare(password, mentor?.password || "");
    if (!isPasswordValid) {
      throwError("Invalid email or password", 401);
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
    
    if (existMentorInmentor) throwError("This mentor is already registered", 400);
    if (existingMentor) throwError("OTP already sent", 400);
    
    const otp = generateOtp();
    sendEmailOtp(email, otp);
    console.log(otp);
    
    await this.mentorOtpRepo.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await this.mentorOtpRepo.findOne({ email, otp });
    if (!otpRecord) {
      throwError("Invalid OTP", 400);
    }
  }

  async mentorSignup(data: Partial<IMentor>) {
    const { isValid, errorMessage } = validateMentorSignupInput(data);
    if (!isValid) throwError(errorMessage || "Unknown error occurred during validation", 400);
    const existMentor = await this.mentorRepo.findOne({ email: data.email });
    if (!existMentor) throwError("Please apply to be a mentor", 400);
    if (existMentor.isVerified) throwError("This mentor is already registered", 400);
    if (existMentor.status !== "approved") throwError(`This request is ${existMentor.status}`, 400);
  
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
    if (!mentor) throwError("User not found", 404);
    
    const token = generateAccessToken(mentor.id, "mentor");
    const resetLink = `${process.env.CLIENT_URL}/mentor/reset-password/${token}`;
    
    const result = await sendPasswordResetEmail(mentor.email, resetLink);
    if (!result.success) {
      throwError("Failed to send reset email. Try again later.", 500);
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    const user = await this.mentorRepo.findById(id);
    if (!user) throwError("Mentor not found", 404);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.mentorRepo.update(id, { password: hashedPassword });
  }
}
