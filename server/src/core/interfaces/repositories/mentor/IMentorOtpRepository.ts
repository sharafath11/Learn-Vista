import { FilterQuery } from 'mongoose';

export interface IMentorOtp {
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface IMentorOtpRepository {
  create(data: Partial<IMentorOtp>): Promise<IMentorOtp>;
  findOne(condition: FilterQuery<IMentorOtp>): Promise<IMentorOtp | null>;
}