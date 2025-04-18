import { inject, injectable } from "inversify";
// import { IAdminMentorRepository } from "../../core/interfaces/admin/IAdminMentorRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { IMentor } from "../../types/mentorTypes";


@injectable()
export class AdminMentorService implements IAdminMentorServices {
  constructor(
    @inject(TYPES.AdminMentorRepository) 
    private adminMentorRepo: IAdminMentorRepository
  ) {}

  async getAllMentors(): Promise<IMentor[]> {
    try {
      return await this.adminMentorRepo.findAll();
    } catch (error) {
      console.error("Error fetching mentors:", error);
      throw error;
    }
  }

  async changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor|null> {
    try {
      const statusString = status ? 'approved' : 'rejected';
      const updated = await this.adminMentorRepo.update(id, {status:statusString});
      
      if (updated && status) {
        await sendMentorStatusChangeEmail(email, statusString);
      }
      
      return updated;
    } catch (error) {
      console.error(`Error changing mentor status for ID ${id}:`, error);
      throw error;
    }
  }

  async toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor|null> {
    try {
      return await this.adminMentorRepo.update(id, {isBlock:isBlock});
    } catch (error) {
      console.error(`Error toggling block status for mentor ${id}:`, error);
      throw error;
    }
  }
  async mentorDetils(id: string):Promise<IMentor> {
    const mentor = await this.adminMentorRepo.findById(id);
    if (!mentor) throw new Error(" Server Error ann mwone");
    return mentor

  }
}