import { FilterQuery } from "mongoose";
import { IMentor } from "../../../../types/mentorTypes";



export interface IAdminMentorRepository {
  findAllMentors(filter?: FilterQuery<IMentor>): Promise<IMentor[]>;
  updateMentorStatus(id: string, status: string): Promise<IMentor | null>;
  blockMentor(id: string, isBlock: boolean): Promise<IMentor | null>;
  countMentors(filter?: FilterQuery<IMentor>): Promise<number>;
}