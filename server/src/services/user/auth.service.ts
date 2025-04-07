import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import userRepository from "../../repositories/user/userRepository";
import {  IUser } from "../../types/userTypes";
import { generateOtp } from "../../utils/otpGenerator";
import { sendEmailOtp } from "../../utils/emailService";
import { decodeToken } from "../../utils/tokenDecode";
import OtpRepository from "../../repositories/user/OtpRepository";
import { validateUserSignupInput } from "../../utils/userValidation";


class AuthService {
  async registerUser(userData: IUser): Promise<IUser> {
    const { name, email, password, role } = userData;

    validateUserSignupInput(name, email, password, role);
    const existingUser = await userRepository.findOne({ email: userData.email });
    const existOtp = await OtpRepository.findOne({ email });
    if(!existOtp) throw new Error("OTP Expired... :)")
    if (existingUser) throw new Error("User already exists");

    userData.password = await bcrypt.hash(userData.password, 10);
    return userRepository.create(userData);
  }

  async sendOtp(email: string): Promise<void> {
    const existingUser = await userRepository.findOne({ email });
    if (existingUser) throw new Error("This email is already registered");
    const exitOtp = await OtpRepository.findOne({ email })
    console.log("exist otp",exitOtp)
    if(exitOtp) throw new Error("OTP already send it")
    const otp = generateOtp();
    await OtpRepository.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    sendEmailOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await OtpRepository.findOne({ email, otp });
    if (!otpRecord) throw new Error("Invalid OTP");
  }

  async loginUser(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    const user = await userRepository.findOne({ email });
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("This account is blocked");
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
  
    const token = jwt.sign(
      { role: "user", userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );
    function importendData(user: any) {
      return {
        
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      };
    }
    
    return { token, refreshToken, user:importendData(user) };
  }
  

  // async refreshAccessToken(refreshToken: string, res: Response): Promise<void> {
  //   if (!refreshToken) throw new Error("Refresh token is required");

  //   try {
  //     const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as JwtPayload;
  //     const newToken = jwt.sign(
  //       { role: "user", userId: decoded.userId }, 
  //       process.env.JWT_SECRET as string, 
  //       { expiresIn: "1h" }
  //     );

  //     res.cookie("token", newToken, {
  //       httpOnly: true, 
  //       secure: process.env.NODE_ENV === "production", 
  //       sameSite: "strict", 
  //     });

  //     res.status(200).json({ token: newToken });
  //   } catch (error) {
  //     throw new Error("Invalid refresh token");
  //   }
  // }

  async getUser(token: string) {
    const decoded = decodeToken(token);
    
    if (!decoded) {
      throw new Error("Invalid token");
    }
    const id = typeof decoded === "object" && "userId" in decoded ? (decoded.userId as string) : decoded;

    if (!id) {
      throw new Error("Invalid user ID");
    }
    const user = await userRepository.findById(id as string);
    if (!user) throw new Error("User not found");
    if (!user.isBlocked) throw new Error("Account blocked");
    return user;
  }
}

export default new AuthService();

