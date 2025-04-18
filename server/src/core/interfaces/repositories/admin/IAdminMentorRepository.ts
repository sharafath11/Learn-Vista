import { FilterQuery } from "mongoose";
import { IMentor } from "../../../../types/mentorTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IAdminMentorRepository extends  IBaseRepository <IMentor, IMentor> {
  
}