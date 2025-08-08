import { injectable, inject } from "inversify";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { IMentor, ISocialLink } from "../../types/mentorTypes";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import bcrypt from "bcrypt";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { deleteFromS3, getSignedS3Url, uploadBufferToS3 } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  private validateMentorApplication(userId: string | JwtPayload, email: string) {
    if (!userId) throwError(Messages.AUTH.AUTH_REQUIRED, StatusCode.BAD_REQUEST);
    if (!email) throwError(Messages.AUTH.EMAIL_REQUIRED, StatusCode.BAD_REQUEST);
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
if (existingMentor)throwError(Messages.MENTOR.APPLICATION_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
if (existingUserMentor) throwError(Messages.MENTOR.USER_ALREADY_APPLIED, StatusCode.BAD_REQUEST);



    let resumeS3Key: string;
    let signedResumeUrl: string;

    try {
      resumeS3Key = await uploadBufferToS3(file.buffer, file.mimetype, 'resumes');
      signedResumeUrl = await getSignedS3Url(resumeS3Key);
    } catch (error) {
      throwError(Messages.RESUME.UPLOAD_FAILED, StatusCode.INTERNAL_SERVER_ERROR);

    }

    const mentorData: Partial<IMentor> = {
      email: email.trim(),
      username: username.trim(),
      phoneNumber: phoneNumber || "",
      isVerified: false,
      cvOrResume: resumeS3Key,
      applicationDate: new Date(),
      userId: new Types.ObjectId(userId as string),
      status: "pending",
      expertise: Array.isArray(expertise) ? expertise : [],
      socialLinks: typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks,
    };

    const application = await this.userRepository.applyMentor(mentorData);
    const ADMIN_ID = process.env.ADMIN_ID;
   if (!ADMIN_ID) throwError(Messages.CONFIG.ADMIN_ID_MISSING, StatusCode.INTERNAL_SERVER_ERROR);


await notifyWithSocket({
  notificationService: this._notificationService,
  userIds: [userId.toString(), ADMIN_ID],
  title: Messages.USERS.NEW_MENTOR_APPLICATION.TITLE,
  message: Messages.USERS.NEW_MENTOR_APPLICATION.getMessage(username),
  type: "info",
});


    return {
      success: true,
      application,
      cvUrl: signedResumeUrl,
    };
  }

  async editProfileService(username: string, imageBuffer: Buffer | undefined, id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) return throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    if (user.isBlocked) throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);

    const updatedUsername = username !== user.username ? username : user.username;
    let imageS3Key: string | null = user.profilePicture || null;

    if (imageBuffer) {
      const newImageKey = await uploadBufferToS3(imageBuffer, 'image/png', 'profile_pictures');

      if (user.profilePicture) {
        if (user.profilePicture.includes("s3.amazonaws.com")) {
          const url = new URL(user.profilePicture);
          const oldImageKey = decodeURIComponent(url.pathname.substring(1));
          await deleteFromS3(oldImageKey).catch((err) =>
            console.error("Failed to delete old S3 profile picture (from URL):", err)
          );
        } else {
          await deleteFromS3(user.profilePicture).catch((err) =>
            console.error("Failed to delete old S3 profile picture (from key):", err)
          );
        }
      }

      imageS3Key = newImageKey;
    }

    await this.userRepository.update(id, {
      username: updatedUsername,
      profilePicture: imageS3Key || "",
    });

    let finalImageUrl: string = "";
    if (imageS3Key) {
      try {
        finalImageUrl = await getSignedS3Url(imageS3Key);
      } catch (error) {
        console.error("Failed to generate signed URL for profile picture:", error);
        finalImageUrl = "";
      }
    }

    return {
      username: updatedUsername,
      image: finalImageUrl,
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findWithPassword({ id: userId });

    if (!user) {
      throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
if (!newPassword.match(/[A-Z]/)) {
  throwError(Messages.AUTH.MUST_HAVE_UPPERCASE, StatusCode.BAD_REQUEST);
}

if (!newPassword.match(/[0-9]/)) {
  throwError(Messages.AUTH.MUST_HAVE_NUMBER, StatusCode.BAD_REQUEST);
}

const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
if (!isPasswordValid) {
  throwError(Messages.AUTH.INVALID_CURRENT, StatusCode.BAD_REQUEST);
}

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  await notifyWithSocket({
  notificationService: this._notificationService,
  userIds: [userId],
  roles: ["user"],
  title: Messages.PROFILE.PASSWORD.CHANGED.TITLE,
  message: Messages.PROFILE.PASSWORD.CHANGED.MESSAGE,
  type: "info",
});

  }
}
