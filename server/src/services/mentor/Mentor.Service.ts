import { inject, injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';
import { throwError } from '../../utils/ResANDError'; 
import { StatusCode } from '../../enums/statusCode.enum'; 
import { getSignedS3Url } from '../../utils/s3Utilits';
import { Messages } from '../../constants/messages';

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private _mentorRepo: IMentorRepository,
  ) {}

  async getMentor(id: string): Promise<Partial<IMentor>> {
    const mentor = await this._mentorRepo.findById(id);
    if (!mentor) throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
    if (mentor.isBlock) throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);

    let signedUrl = "";
    if (mentor.profilePicture) {
      signedUrl = await getSignedS3Url(mentor.profilePicture as string);
    }

    return {
      id: mentor.id,
      username: mentor.username,
      email: mentor.email,
      expertise: mentor.expertise,
      experience: mentor.experience,
      bio: mentor.bio,
      applicationDate: mentor.applicationDate,
      phoneNumber: mentor.phoneNumber || "",
      profilePicture: signedUrl || mentor.profilePicture,
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses,
      coursesCreated: mentor.coursesCreated,
      reviews: mentor.reviews
    };
  }
}

