import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import { IMentor } from "../../types/mentorTypes";
import { Types } from "mongoose";
import userRepository from "../../repositories/user/userRepository";
import { validateMentorApplyInput } from "../../utils/userValidation";

class ProfileService {
  async applyMentor(
    email: string,
    username: string,
    file: Express.Multer.File,
    userId: string | JwtPayload,
    phoneNumber: string
  ) {
    try {
    
      const { isValid, errorMessage } = validateMentorApplyInput(email, username, phoneNumber, file);
      if (!isValid) throw new Error(errorMessage);

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
        expertise: [],
        socialLinks: [],
      };
      const application = await userRepository.applyMentor(mentorData);

      return {
        success: true,
        application,
        cvUrl: uploadResult.secure_url,
      };
    } catch (error: any) {
      console.error("Mentor application error:", {
        email,
        username,
        error: error.message,
        stack: error.stack,
      });

      let errorMessage = error.message;
      if (error.message.includes("File size limit exceeded")) {
        errorMessage = "File must be smaller than 10MB";
      } else if (error.message.includes("Cloudinary")) {
        errorMessage = "File upload service unavailable. Please try again later.";
      } else if (error.message.includes("duplicate key")) {
        errorMessage = "You have already submitted a mentor application.";
      }

      throw new Error(errorMessage);
    }
  }
}

export default new ProfileService();
