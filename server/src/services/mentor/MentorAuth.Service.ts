import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';

import { generateOtp } from '../../utils/otpGenerator';
import { sendEmailOtp } from '../../utils/emailService';
import { IMentor, SafeMentor } from '../../types/mentorTypes';
import { validateMentorSignupInput } from '../../utils/mentorValidation';
import { ObjectId, Types } from 'mongoose';

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
    if (mentor?.isBlock) throw new Error("This account is blok")
    if (mentor?.status !== "approved") throw new Error(`This user ${mentor?.status}`);
   
    if (!mentor) {
      throw new Error("Mentor not found");
    }
    
    if (!mentor.isVerified) throw new Error("Please signup")
    const isPasswordValid = await bcrypt.compare(password, mentor?.password || "");
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    const payload = { role: "mentor", mentorId: mentor.id };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  
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
        reviews: mentor.reviews
        
      },
      token,
      refreshToken,
    };
  }
  async sendOtp(email: string): Promise<void> {
    const existingMentor = await this.mentorOtpRepo.findOne({ email });
    const existMentorInmentor = await this.mentorRepo.findOne({ email, isVerified: true })
    if( existMentorInmentor) throw new Error("This mentor already register")
      if (existingMentor) throw new Error("Already send OTP");
      
    const otp = generateOtp();
    sendEmailOtp(email, otp);
    console.log(otp)
    await this.mentorOtpRepo.create({ email,otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
     
  }
  async verifyOtp(email: string, otp: string): Promise<void> {
    
    const otpRecord = await this.mentorOtpRepo.findOne({ email, otp } );
    if (!otpRecord) {
      throw new Error("Invalid OTP");
    }
   }
   async mentorSignup(data: Partial<IMentor>) {
    const { isValid, errorMessage } = validateMentorSignupInput(data);
    if (!isValid) throw new Error(errorMessage);
  
    const existMentor = await this.mentorRepo.findOne({ email: data.email });
    if (!existMentor) throw new Error("Please apply to be a mentor");
    if (existMentor.isVerified) throw new Error("This mentor is already registered");
    if (existMentor.status !== "approved") throw new Error(`This request is ${existMentor.status}`);
  
    const hashedPassword = await bcrypt.hash(data.password!, await bcrypt.genSalt(10));
  
    const allowedUpdates: Partial<IMentor> = {
      phoneNumber: data.phoneNumber,
      experience: data.experience ? Number(data.experience) : undefined,
      bio:data.bio,
      password: hashedPassword
    };
    
    await this.mentorRepo.update(existMentor.id , { ...allowedUpdates, isVerified: true });
    
  }
  

  
}