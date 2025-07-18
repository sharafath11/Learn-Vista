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
import { StatusCode } from "../../enums/statusCode.enum";
import bcrypt from "bcrypt"
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
     @inject(TYPES.NotificationService) private _notificationService: INotificationService 
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
          if (error) return reject(throwError(`File upload failed: ${error.message}`, StatusCode.INTERNAL_SERVER_ERROR));
          if (!result) return reject(throwError("No result from Cloudinary", StatusCode.INTERNAL_SERVER_ERROR));
          resolve({ secure_url: result.secure_url });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  private validateMentorApplication(userId: string | JwtPayload, email: string) {
    if (!userId) throwError("Authentication required", StatusCode.BAD_REQUEST);
    if (!email) throwError("Email is required", StatusCode.BAD_REQUEST);
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
      this.mentorRepo.findOne({ userId }),
    ]);

    if (existingMentor) throwError("Mentor application already submitted for this email", StatusCode.BAD_REQUEST);
    if (existingUserMentor) throwError("You have already applied", StatusCode.BAD_REQUEST);

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
      socialLinks: typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks,
    };

    const application = await this.userRepository.applyMentor(mentorData);
    const ADMIN_ID = process.env.ADMIN_ID;
    if (!ADMIN_ID) throwError("Admin ID not configured", StatusCode.INTERNAL_SERVER_ERROR);

    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [userId.toString(), ADMIN_ID],
      title: " New Mentor Application",
      message: `${username} has applied to become a mentor.`,
      type: "info",
    });
    return {
      success: true,
      application,
      cvUrl: uploadResult.secure_url,
    };
  }

  async editProfileService(username: string, imageBuffer: Buffer | undefined, id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) return throwError("User not found", StatusCode.NOT_FOUND);
    if (user.isBlocked) throwError("This user was Blocked", StatusCode.FORBIDDEN);

    const updatedUsername = username !== user.username ? username : user.username;
    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : user.profilePicture;

    if (imageBuffer && user.profilePicture?.includes("cloudinary")) {
      await deleteFromCloudinary(user.profilePicture).catch((err) =>
        console.error("Failed to delete old profile picture:", err)
      );
    }

    const safeImageUrl = imageUrl || "";

    await this.userRepository.update(id, {
      username: updatedUsername,
      profilePicture: safeImageUrl,
    });

    return {
      username: updatedUsername,
      image: safeImageUrl,
    };
  }
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findWithPassword({id:userId});
  
    if (!user) {
      throwError("User not found", StatusCode.NOT_FOUND);
    }
    if (!newPassword.match(/[A-Z]/)) {
      throwError("New password must contain at least one uppercase letter", StatusCode.BAD_REQUEST);
    }
    if (!newPassword.match(/[0-9]/)) {
      throwError("New password must contain at least one number", StatusCode.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throwError("Invalid current password", StatusCode.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [userId],
    roles: ["user"],
    title: "🔐 Password Changed",
    message: "Your password was changed successfully",
    type: "info",
  });
  }
}
