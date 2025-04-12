// src/repositories/user/UserRepository.ts
import { injectable } from "inversify";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { userModel } from "../../models/user/userModel";
import { IMentor } from "../../types/mentorTypes";
import { BaseRepository } from "../BaseRepository";
import { IUser } from "../../types/userTypes";
import { Document } from "mongoose";

@injectable()
export class UserRepository extends BaseRepository<IUser & Document, IUser> implements IUserRepository {
  constructor() {
    super(userModel);
  }

  async applyMentor(mentorData: Partial<IMentor>): Promise<unknown> {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        mentorData.userId,
        { $set: { mentorApplication: mentorData } },
        { new: true }
      );
      return updatedUser ? this.toDTO(updatedUser) : null;
    } catch (error) {
      throw this.handleError(error, 'Error applying as mentor');
    }
  }
}