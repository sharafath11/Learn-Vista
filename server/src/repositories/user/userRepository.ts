// src/repositories/user/UserRepository.ts
import { injectable } from "inversify";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { userModel } from "../../models/user/userModel";
import { IMentor } from "../../types/mentorTypes";
import { BaseRepository } from "../BaseRepository";
import { IUser } from "../../types/userTypes";
import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";


@injectable()
export class UserRepository extends BaseRepository<IUser , IUser> implements IUserRepository
 {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
  ) {
    super(userModel);
  }

  async applyMentor(mentorData: Partial<IMentor>): Promise<void> {
    const existingMentor = await this.mentorRepo.findOne({ 
      email: mentorData.email 
    });
  
    if (existingMentor) {
      throw new Error("Mentor application already submitted");
    }
    console.log(mentorData.userId)
    const existingMentorAtSameUser = await this.mentorRepo.findOne({ userId: mentorData.userId });
    if (existingMentorAtSameUser) {
      throw new Error("You already applied :)");
    }
  
    let expertise = mentorData.expertise;
    if (typeof expertise === "string") {
      expertise = JSON.parse(expertise);
    }
  
    const applyData = { ...mentorData, experties: expertise };
  
    await this.mentorRepo.create(applyData as Partial<IMentor>);
  }
  
  
}