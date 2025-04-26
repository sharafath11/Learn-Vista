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
import { throwError } from "../../utils/ResANDError";

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
          if (error) return reject(throwError(`File upload failed: ${error.message}`, 500));
          if (!result) return reject(throwError("No result from Cloudinary", 500));
          resolve({ secure_url: result.secure_url });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  private validateMentorApplication(userId: string | JwtPayload, email: string) {
    if (!userId) throwError("Authentication required", 400);
    if (!email) throwError("Email is required", 400);
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
    this.validateMentorApplication(userId, email);

    const [existingMentor, existingUserMentor] = await Promise.all([
      this.mentorRepo.findOne({ email }),
      this.mentorRepo.findOne({ userId })
    ]);

    if (existingMentor) throwError("Mentor application already submitted for this email", 400);
    if (existingUserMentor) throwError("You have already applied", 400);

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
  }

  async editProfileService(username: string, imageBuffer: Buffer | undefined, id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) return throwError("User not found", 404);
    if (user.isBlocked) throwError("This user was Blocked", 403);
    
    const updatedUsername = username !== user.username ? username : user.username;
    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : user.profilePicture;
    
    if (imageBuffer && user.profilePicture?.includes('cloudinary')) {
      await deleteFromCloudinary(user.profilePicture).catch(err =>
        console.error("Failed to delete old profile picture:", err)
      );
    }

    const safeImageUrl = imageUrl || ''; 
    await this.userRepository.update(id, {
      username: updatedUsername,
      profilePicture: safeImageUrl,
    });

    return {
      username: updatedUsername,
      image: safeImageUrl, 
    };
  }
}