import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import  MentorOtpRepo from "../../repositories/mentor/otpRepo"
import { IMentor } from "../../types/mentorTypes";
import { sendEmailOtp } from "../../utils/emailService";
import { generateOtp } from "../../utils/otpGenerator";
import MentorRepo from "../../repositories/mentor/MentorRepo";
import { validateMentorSignupInput } from "../../utils/mentorValidation";
import { error } from "console";

class MentorAuthService {
  async loginMentor(
    email: string,
    password: string,
    res: Response
  ): Promise<{ mentor: any; token: string; refreshToken: string }> {
    const mentor = await MentorRepo.findOne({ email });
    if (mentor?.status !== "approved") throw new Error(`This user ${mentor?.status}`);
    if (!mentor) {
      throw new Error("Mentor not found");
    }
    if (!mentor.isVerified) throw new Error("Please signup")
    const isPasswordValid = await bcrypt.compare(password, mentor?.password || "");
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    const payload = { role: "mentor", mentorId: mentor._id };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  
    const isProd = process.env.NODE_ENV === "production";
  
    res.cookie("mentorToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });
  
    res.cookie("mentorRefreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
  
    return {
      mentor: {
        _id: mentor._id,
        username: mentor.username,
        email: mentor.email,
        expertise: mentor.expertise,
        experience: mentor.experience,
        bio: mentor.bio,
        phoneNumber: mentor?.phoneNumber || "",
        socialLinks: mentor.socialLinks,
        liveClasses: mentor.liveClasses,
        coursesCreated: mentor.coursesCreated,
        reviews:mentor.reviews
        
      },
      token,
      refreshToken,
    };
    
  }
  
  

  async refreshAccessToken(refreshToken: string, res: Response): Promise<void> {
    if (!refreshToken) throw new Error("Refresh token is required");

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as JwtPayload;
      
      const newToken = jwt.sign(
        { role: "mentor", mentorId: decoded.mentorId },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.cookie("Mtoken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });

      res.status(200).json({ token: newToken });
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  };
  async sendOtp(email: string): Promise<void> {
    const existingMentor = await MentorOtpRepo.findOne({ email });
    const existMentorInmentor = await MentorRepo.findOne({ email, isVerified: true })
    if( existMentorInmentor) throw new Error("This mentor already register")
      if (existingMentor) throw new Error("Already send OTP");
      
    const otp = generateOtp();
    sendEmailOtp(email, otp);
    await MentorOtpRepo.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
     
  }
  async verifyOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await MentorOtpRepo.findOne({ email, otp } );
    if (!otpRecord) {
      throw new Error("Invalid OTP");
      }
   }
  async mentorSignup(data: Partial<IMentor>) {
    const { isValid, errorMessage } = validateMentorSignupInput(data);

  if (!isValid) {
   throw new Error (errorMessage )
  }
      const existMentor = await MentorRepo.findOne({ email: data.email });
      if (existMentor?.isVerified) {
        throw new Error(`This mentor already register `)
      }
    if (existMentor?.status!=="approved") {
      throw new Error(`This requst are ${existMentor?.status} `)
      
    };
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password!, salt);
    console.log(hashedPassword)
    const newMentorData = { ...data, password: hashedPassword,experience:Number(data.experience) };
    console.log(newMentorData)
    await MentorRepo.update(existMentor._id as string, {...newMentorData });
}

}

export default new MentorAuthService();
