import { injectable } from "inversify";
import mentorModel from "../../models/mentor/mentorModel";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { IMentor } from "../../types/mentorTypes";
import { BaseRepository } from "../BaseRepository";


@injectable()
export class AdminMentorRepository extends BaseRepository <IMentor,IMentor> implements IAdminMentorRepository {
  constructor() {
     super(mentorModel);
  }
  
}