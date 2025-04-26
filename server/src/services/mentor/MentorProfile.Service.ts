import { inject, injectable } from "inversify";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { TYPES } from "../../core/types";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudImage";
import { throwError } from "../../utils/ResANDError";

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
    ): Promise<{ username: string; image: string; bio: string }> {
        const mentor = await this.mentorRepo.findById(id);
        if (!mentor) throwError("Mentor not found",404);
        if (mentor.isBlock) throwError("This mentor is blocked",403);
        
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
            bio: updatedBio
        };
    }
}
