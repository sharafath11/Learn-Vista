import { IMentor } from "../../../../types/mentorTypes";
import { IUser } from "../../../../types/userTypes";
import { IBaseRepository } from "../IBaseRepository";


export interface IUserRepository extends IBaseRepository<IUser , IUser> {
  applyMentor(mentorData: Partial<IMentor>): Promise<IMentor>
 }