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
import { toDTO } from "../../utils/toDTO";


@injectable()
export class UserRepository extends BaseRepository<IUser , IUser> implements IUserRepository
 {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
  ) {
    super(userModel);
  }

  async applyMentor(mentorData: Partial<IMentor>): Promise<IMentor> {
    
  
    let expertise = mentorData.expertise;
    if (typeof expertise === "string") {
      expertise = JSON.parse(expertise);
    }
  
    const applyData = { ...mentorData, experties: expertise };
  
    const result = await this.mentorRepo.create(applyData as Partial<IMentor>);
    const dtoData=toDTO<IMentor>(result)
    return dtoData
    
  }
  
  
}