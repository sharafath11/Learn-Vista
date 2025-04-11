import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/types';
import { IMentorRepository } from '../../core/interfaces/repositories/IMentorRepository';
import { userModel } from '../../models/user/userModel';
import { BaseRepository } from '../BaseRepository';
import { IUser } from '../../types/userTypes';
import { IMentor } from '../../core/models/Mentor';

@injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository
  ) {
    super(userModel);
  }

  async applyMentor(mentorData: Partial<IMentor>): Promise<IMentor> {
    try {
      const existingMentor = await this.mentorRepo.findOne({ email: mentorData.email });
      if (existingMentor) {
        throw new Error("Mentor application already submitted");
      }
      
      const processedData: Partial<IMentor> = {
        ...mentorData,
        socialLinks: mentorData.socialLinks ? 
          mentorData.socialLinks.map(link => typeof link === 'string' ? link : JSON.stringify(link)) : 
          []
      };

      const mentor = await this.mentorRepo.create(processedData);
      return mentor;
    } catch (error) {
      console.error("Error applying as mentor:", error);
      throw new Error("Failed to apply as mentor");
    }
  }
}