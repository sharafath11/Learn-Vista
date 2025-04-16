import { injectable, inject } from "inversify";
import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import { Types } from "mongoose";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { IMentor } from "../../types/mentorTypes";


@injectable()
export class ProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async applyMentor(
    email: string, username: string, file: Express.Multer.File, expertise: string[],
    userId: string | JwtPayload, phoneNumber: string
  ) {
    if (!userId) throw new Error("Please login");
  
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "LearnVista/mentors/resumes",
          public_id: `mentor-cv-${Date.now()}-${username.replace(/\s+/g, "-")}`,
          use_filename: true,
          unique_filename: false,
          flags: "attachment",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as any);
        }
      );
      uploadStream.end(file.buffer);
    });
  
    const mentorData: Partial<IMentor> = {
      email: email.trim(),
      username: username.trim(),
      phoneNumber: phoneNumber || "",
      isVerified: false,
      cvOrResume: uploadResult.secure_url,
      applicationDate: new Date(),
      userId: new Types.ObjectId(userId as string),
      status: "pending",
      expertise: expertise,
      socialLinks: [],
    };
  
    const application = await this.userRepository.applyMentor(mentorData);
  
    return {
      success: true,
      application,
      cvUrl: uploadResult.secure_url,
    };
  }
  
}
