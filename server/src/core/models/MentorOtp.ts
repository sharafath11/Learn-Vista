import { Document } from 'mongoose';

export interface IMentorOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}