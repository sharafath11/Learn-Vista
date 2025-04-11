import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
// import { IMentorRepository } from '../../core/interfaces/repositories/IMentorRepository';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';
import { IMentor } from '../../core/models/Mentor';
import { generateOtp } from '../../utils/otpGenerator';
import { sendEmailOtp } from '../../utils/emailService';
import { validateMentorSignupInput } from '../../utils/mentorValidation';


@injectable()
export class MentorAuthService implements IMentorAuthService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.MentorOtpRepository) private mentorOtpRepo: IMentorOtpRepository
  ) {}

  async loginMentor(
    email: string,
    password: string,
    res: Response
  ): Promise<{ mentor: Partial<IMentor>; token: string; refreshToken: string }> {
    const mentor = await this.mentorRepo.findOne({ email });
    
    if (!mentor) throw new Error('Mentor not found');
    if (mentor.isBlock) throw new Error('This account is blocked');
    if (mentor.status !== 'approved') throw new Error(`This user is ${mentor.status}`);
    if (!mentor.isVerified) throw new Error('Please complete signup first');

    const isPasswordValid = mentor.password 
    ? await bcrypt.compare(password, mentor.password)
    : false;
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const payload = { role: 'mentor', mentorId: mentor._id };
    const token = this.generateToken(payload, process.env.JWT_SECRET!, '1h');
    const refreshToken = this.generateToken(payload, process.env.REFRESH_SECRET!, '7d');

    this.setCookies(res, token, refreshToken);

    return {
      mentor: this.sanitizeMentor(mentor),
      token,
      refreshToken
    };
  }

  async sendOtp(email: string): Promise<void> {
    const [existingOtp, existingMentor] = await Promise.all([
      this.mentorOtpRepo.findOne({ email }),
      this.mentorRepo.findOne({ email, isVerified: true })
    ]);

    if (existingMentor) throw new Error('This mentor is already registered');
    if (existingOtp) throw new Error('OTP already sent');

    const otp = generateOtp();
    await sendEmailOtp(email, otp);
    await this.mentorOtpRepo.create({ 
      email, 
      otp, 
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    });
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await this.mentorOtpRepo.findOne({ email, otp });
    if (!otpRecord) throw new Error('Invalid OTP');
  }

  async mentorSignup(data: Partial<IMentor>): Promise<void> {
    if (!data.password) throw new Error('Password is required');
    if (!data.experience) throw new Error('Experience is required');

    const existingMentor = await this.mentorRepo.findOne({ email: data.email });
    if (!existingMentor) throw new Error('Mentor not found');
    if (existingMentor.isVerified) throw new Error('Mentor already registered');
    if (existingMentor.status !== 'approved') throw new Error(`Request is ${existingMentor.status}`);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const updatedData = { 
        ...data, 
        password: hashedPassword,
        experience: Number(data.experience),
        isVerified: true
    };

    await this.mentorRepo.update(existingMentor._id.toString(), updatedData);
}

  // Helper Methods
  private generateToken(payload: object, secret: string, expiresIn: string): string {
    if (!secret) throw new Error('JWT secret is not defined');
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

  private setCookies(res: Response, token: string, refreshToken: string): void {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
    };

    res.cookie('mentorToken', token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.cookie('mentorRefreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  private sanitizeMentor(mentor: IMentor): Partial<IMentor> {
    const { password, ...mentorWithoutPassword } = mentor.toObject ? mentor.toObject() : mentor;
    return mentorWithoutPassword;
  }
}