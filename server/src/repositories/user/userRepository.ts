import { injectable } from "inversify";

import { BaseRepository } from "../BaseRepository";

import { FilterQuery, UpdateQuery } from "mongoose";
import { Document } from "mongoose";
import { IUser } from "../../types/userTypes";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { userModel } from "../../models/user/userModel";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  model: any;
  constructor() {
    super(userModel);
  }

  async applyMentor(mentorData: any): Promise<any> {
    // Implementation from your existing code
    try {
      const existingMentor = await this.model.findOne({ email: mentorData.email });
      if (existingMentor) {
        throw new Error("Mentor application already submitted");
      }
      
      const processedData = {
        ...mentorData,
        socialLinks: mentorData.socialLinks ? 
          mentorData.socialLinks.map((link: any) => typeof link === 'string' ? link : JSON.stringify(link)) : 
          []
      };

      const mentor = await this.model.create(processedData);
      return mentor;
    } catch (error) {
      console.error("Error applying as mentor:", error);
      throw new Error("Failed to apply as mentor");
    }
  }
}