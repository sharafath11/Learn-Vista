import { inject, injectable } from "inversify";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { TYPES } from "../../core/types";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudImage";
@injectable()
export class MentorProfileService implements IMentorProfileService {
    constructor(
        @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository
    ) {}

    async editProfile(
        username: string, 
        bio: string, 
        imageBuffer: Buffer | undefined, 
        id: string
    ): Promise<{ username: string; image: string;bio:string }> {
        try {
            const mentor = await this.mentorRepo.findById(id);
            if (!mentor) throw new Error("Mentor not found");
            if (mentor.isBlock) throw new Error("This mentor is blocked");
            
            const updatedUsername = username !== mentor.username ? username : mentor.username;
            const updatedBio = bio !== mentor.bio ? bio : mentor.bio;
            const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : mentor.profilePicture;
            
            if (imageBuffer && mentor.profilePicture?.includes('cloudinary')) {
                await deleteFromCloudinary(mentor.profilePicture).catch(err =>
                    console.error("Failed to delete old profile picture:", err)
                );
            }

            const safeImageUrl = imageUrl || '';
            await this.mentorRepo.update(id, {
                username: updatedUsername,
                bio: updatedBio,
                profilePicture: safeImageUrl,
            });

            return {
                username: updatedUsername,
                image: safeImageUrl,
                bio:updatedBio
            };
        } catch (error) {
            console.error('Mentor profile update failed:', error);
            throw new Error(error instanceof Error ? error.message : "Mentor profile update failed");
        }
    }
}
