import { inject, injectable } from "inversify";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { TYPES } from "../../core/types";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudImage";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import bcrypt from "bcrypt"
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { logger } from "../../utils/logger";

@injectable()
export class MentorProfileService implements IMentorProfileService {
    constructor(
        @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
        @inject(TYPES.NotificationService) private _notificationService:INotificationService
    ) {}

    // async editProfile(
    //     username: string,
    //     bio: string,
    //     imageBuffer: Buffer | undefined,
    //     expertise:string[],
    //     id: string
    // ): Promise<{ username: string; image: string; bio: string }> {
    //     const mentor = await this.mentorRepo.findById(id);
    //     if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
    //     if (mentor.isBlock) throwError("This mentor is blocked", StatusCode.FORBIDDEN);
    //   
    //     const updatedUsername = username !== mentor.username ? username : mentor.username;
    //     const updatedBio = bio !== mentor.bio ? bio : mentor.bio;
    //     const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : mentor.profilePicture;
        
    //     if (imageBuffer && mentor.profilePicture?.includes('cloudinary')) {
    //         await deleteFromCloudinary(mentor.profilePicture).catch(err =>
    //             console.error("Failed to delete old profile picture:", err)
    //         );
    //     }

    //     const safeImageUrl = imageUrl || '';

    //     await this.mentorRepo.update(id, {
    //         username: updatedUsername,
    //         bio: updatedBio,
    //         profilePicture: safeImageUrl,
    //         expertise: Array.isArray(expertise) ? expertise : [],
            
    //     });

    //     return {
    //         username: updatedUsername,
    //         image: safeImageUrl,
    //         bio: updatedBio,
            
    //     };
    // }
    async editProfile(
        username: string,
        bio: string,
        imageBuffer: Buffer | undefined,
        expertise: string[] | string,
        id: string
    ): Promise<{ username: string; image: string; bio: string; expertise: string[] }> {
        const mentor = await this.mentorRepo.findById(id);
        if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
        if (mentor.isBlock) throwError("This mentor is blocked", StatusCode.FORBIDDEN);
    
        
        let parsedExpertise: string[] = [];
        if (typeof expertise === 'string') {
            try {
                parsedExpertise = JSON.parse(expertise);
                if (!Array.isArray(parsedExpertise)) {
                    parsedExpertise = [];
                }
            } catch (err) {
                logger.warn(err)
                parsedExpertise = [];
            }
        } else if (Array.isArray(expertise)) {
            parsedExpertise = expertise;
        }
    
        const updatedUsername = username !== mentor.username ? username : mentor.username;
        const updatedBio = bio !== mentor.bio ? bio : mentor.bio;
    
        const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : mentor.profilePicture;
    
       
        if (imageBuffer && mentor.profilePicture?.includes('cloudinary')) {
            await deleteFromCloudinary(mentor.profilePicture).catch(err =>
                console.error("Failed to delete old profile picture:", err)
            );
        }
    
        const safeImageUrl = imageUrl || '';
    
        const updateData: {
            username: string;
            bio: string;
            profilePicture: string;
            expertise?: string[];
        } = {
            username: updatedUsername,
            bio: updatedBio,
            profilePicture: safeImageUrl,
        };
    
        if (parsedExpertise.length > 0) {
            updateData.expertise = parsedExpertise;
        }
    
        await this.mentorRepo.update(id, updateData);
    
        return {
            username: updatedUsername,
            image: safeImageUrl,
            bio: updatedBio,
            expertise: parsedExpertise,
        };
    }
    
    async changePassword(mentorId: string, currentPassword: string, newPassword: string): Promise<void> {
        const mentor = await this.mentorRepo.findById(mentorId);
        if (!mentor) {
          throwError("User not found", StatusCode.NOT_FOUND);
        }
        if (!newPassword.match(/[A-Z]/)) {
            throwError("New password must contain at least one uppercase letter", StatusCode.BAD_REQUEST);
          }
          if (!newPassword.match(/[0-9]/)) {
            throwError("New password must contain at least one number", StatusCode.BAD_REQUEST);
          }
        const isPasswordValid = await bcrypt.compare(currentPassword, mentor.password);
        if (!isPasswordValid) {
          throwError("Invalid current password", StatusCode.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.mentorRepo.update(mentorId, { password: hashedPassword });
        await notifyWithSocket({
            notificationService: this._notificationService,
            userIds: [mentorId],
            title: " Password was changed",
            message: "Your password has been change.",
            type: "info",
          });
      }
}
