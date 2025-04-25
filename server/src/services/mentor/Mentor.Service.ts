import { inject, injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';
import { throwError } from '../../utils/ResANDError'; 

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository
  ) {}

  async getMentor(id: string): Promise<Partial<IMentor>> {
    const mentor = await this.mentorRepo.findById(id);
    console.log(mentor);
    
    if (!mentor) {
      throwError("Please login", 401); 
    }
    
    if (mentor.isBlock) {
      throwError("Your account was blocked. Please contact support", 403); 
    }
    
    return {
      username: mentor.username,
      email: mentor.email,
      expertise: mentor.expertise,
      experience: mentor.experience,
      bio: mentor.bio,
      applicationDate: mentor.applicationDate,
      phoneNumber: mentor.phoneNumber || "",
      profilePicture: mentor.profilePicture,
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses,
      coursesCreated: mentor.coursesCreated,
      reviews: mentor.reviews
    };
  }
}
