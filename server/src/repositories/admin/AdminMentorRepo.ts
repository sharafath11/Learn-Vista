import { injectable } from "inversify";
import mentorModel from "../../models/mentor/mentorModel";
// import { IAdminMentorRepository } from "../../core/interfaces/admin/IAdminMentorRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { IMentor } from "../../core/models/Mentor";

@injectable()
export class AdminMentorRepository implements IAdminMentorRepository {
  async findAllMentors(filter = {}): Promise<IMentor[]> {
    return mentorModel.find(filter).lean();
  }

  async updateMentorStatus(id: string, status: string): Promise<IMentor | null> {
    return mentorModel.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    ).lean();
  }

  async blockMentor(id: string, isBlock: boolean): Promise<IMentor | null> {
    return mentorModel.findByIdAndUpdate(
      id,
      { isBlock },
      { new: true }
    ).lean();
  }

  async countMentors(filter = {}): Promise<number> {
    return mentorModel.countDocuments(filter);
  }
}