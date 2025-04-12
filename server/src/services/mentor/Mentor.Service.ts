import { inject, injectable } from 'inversify';
// import { IMentorService } from '../../core/interfaces/services/mentor/IMentorService';
// import { IMentorRepository } from '../../core/interfaces/repositories/IMentorRepository';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository
  ) {}

  async getMentor(id: string): Promise<Partial<IMentor>> {
    const mentor = await this.mentorRepo.findById(id);
    
    if (!mentor) throw new Error("Please login");
    if (mentor.isBlock) throw new Error("Your account was blocked. Please contact support");

    return {
      username: mentor.username,
      email: mentor.email,
      expertise: mentor.expertise,
      experience: mentor.experience,
      bio: mentor.bio,
      applicationDate: mentor.applicationDate,
      phoneNumber: mentor.phoneNumber || "",
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses,
      coursesCreated: mentor.coursesCreated,
      reviews: mentor.reviews
    };
  }
}