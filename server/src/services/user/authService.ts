import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { ObjectId } from "mongoose";

import userRepository from "../../repositories/userRepository";
import OtpRepository from "../../repositories/OtpRepository";
import { IUser } from "../../types/userTypes";
import { generateOtp } from "../../utils/otpGenerator";
import { sendEmailOtp } from "../../utils/emailService";

const TOKEN_EXPIRATION = "1h";
const COOKIE_MAX_AGE = 15 * 60 * 1000;

class AuthService {
  async registerUser(userData: IUser): Promise<IUser> {
    const existingUser = await userRepository.findOne({ email: userData.email });
    if (existingUser) throw new Error("User already exists");

    userData.password = await bcrypt.hash(userData.password, 10);
    return userRepository.create(userData);
  }

  async sendOtp(email: string): Promise<void> {
    const existingUser = await userRepository.findOne({ email });
    if (existingUser) throw new Error("This email is already registered");

    const otp = generateOtp();
    await OtpRepository.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await OtpRepository.findOne({ email, otp });
    if (!otpRecord) throw new Error("Invalid OTP");
  }

  async loginUser(email: string, password: string, res: Response): Promise<void> {
    const user = await userRepository.findOne({ email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { 
        id: user._id, 
        userName: user.name, 
        email: user.email, 
        role: user.role, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt, 
        enrolledCourses: user.enrolledCourses 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(200).json({ success: true, message: "Login successful", token, user });
  }

  async getUser(id: ObjectId) {
    const user = await userRepository.findById(id.toString());
    if (!user) throw new Error("User not found");
    return user
  }
}

export default new AuthService();
