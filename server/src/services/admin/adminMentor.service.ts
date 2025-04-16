import { inject, injectable } from "inversify";
// import { IAdminMentorRepository } from "../../core/interfaces/admin/IAdminMentorRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";

@injectable()
export class AdminMentorService implements IAdminMentorServices{
  constructor(
    @inject(TYPES.AdminMentorRepository) 
    private adminMentorRepo: IAdminMentorRepository
  ) {}

  async getAllMentors() {
    

    
    
  }

  async changeMentorStatus(id: string, status: string, email: string) {
    const mentor = await this.adminMentorRepo.updateMentorStatus(id, status);
    if (status === 'approved') {
      await sendMentorStatusChangeEmail(email, status);
    }
   
  }

  async toggleMentorBlock(id: string, isBlock: boolean) {
     this.adminMentorRepo.blockMentor(id, isBlock);
  }
}