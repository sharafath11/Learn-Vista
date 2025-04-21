import { injectable, inject } from "inversify";
import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import { Types } from "mongoose";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { IMentor, ISocialLink } from "../../types/mentorTypes";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudImage";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
  ) {}

  private async uploadMentorResume(file: Express.Multer.File, username: string) {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
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
          if (error) return reject(new Error(`File upload failed: ${error.message}`));
          if (!result) return reject(new Error("No result from Cloudinary"));
          resolve({ secure_url: result.secure_url });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  private validateMentorApplication(userId: string | JwtPayload, email: string) {
    if (!userId) throw new Error("Authentication required");
    if (!email) throw new Error("Email is required");
  }

  async applyMentor(
    email: string, 
    username: string, 
    file: Express.Multer.File, 
    expertise: string[],
    userId: string | JwtPayload, 
    phoneNumber: string,
    socialLinks: ISocialLink[] | string
  ) {
    try {
      this.validateMentorApplication(userId, email);

      const [existingMentor, existingUserMentor] = await Promise.all([
        this.mentorRepo.findOne({ email }),
        this.mentorRepo.findOne({ userId })
      ]);

      if (existingMentor) throw new Error("Mentor application already submitted for this email");
      if (existingUserMentor) throw new Error("You have already applied");

      const uploadResult = await this.uploadMentorResume(file, username);

      const mentorData: Partial<IMentor> = {
        email: email.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber || "",
        isVerified: false,
        cvOrResume: uploadResult.secure_url,
        applicationDate: new Date(),
        userId: new Types.ObjectId(userId as string),
        status: "pending",
        expertise: Array.isArray(expertise) ? expertise : [],
        socialLinks: typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks,
      };

      const application = await this.userRepository.applyMentor(mentorData);

      return {
        success: true,
        application,
        cvUrl: uploadResult.secure_url,
      };
    } catch (error) {
      console.error("Mentor application failed:", error);
      throw error instanceof Error ? error : new Error("Mentor application failed");
    }
  }

  async editProfileService(username: string, imageBuffer: Buffer | undefined, id: string) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new Error("User not found");
  
      // If the username is the same, don't update it
      const updatedUsername = username !== user.username ? username : user.username;
  
      // If no image is provided, keep the existing image
      const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : user.profilePicture;
  
      // If the profile picture exists and is from Cloudinary, delete the old image
      if (imageBuffer && user.profilePicture?.includes('cloudinary')) {
        await deleteFromCloudinary(user.profilePicture).catch(err =>
          console.error("Failed to delete old profile picture:", err)
        );
      }
  
      // Ensure the image is always a string (fallback to an empty string if null or undefined)
      const safeImageUrl = imageUrl || ''; // Fallback to an empty string if no image URL
  
      // Update the user data
      await this.userRepository.update(id, {
        username: updatedUsername,
        profilePicture: safeImageUrl,
      });
  
      return {
        username: updatedUsername,
        image: safeImageUrl,  // Always a string
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error(error instanceof Error ? error.message : "Profile update failed");
    }
  }
  
  
}