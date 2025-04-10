
import { IMentor } from "../../types/mentorTypes";
import { IUser } from "../entities/user.entity";

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findOne(condition: Partial<IUser>): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  applyMentor(mentorData: Partial<IMentor>): Promise<IMentor>;
  findByEmail(email: string): Promise<IUser | null>;
  blockUser(id: string): Promise<IUser | null>;
  unblockUser(id: string): Promise<IUser | null>;
}