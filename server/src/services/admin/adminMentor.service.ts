import { inject, injectable } from "inversify";
// import { IAdminMentorRepository } from "../../core/interfaces/admin/IAdminMentorRepository";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";

@injectable()
export class AdminMentorService {
  constructor(
    @inject(TYPES.AdminMentorRepository) 
    private adminMentorRepo: IAdminMentorRepository
  ) {}

  async getAllMentors(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const filter = {
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    };

    const [mentors, total] = await Promise.all([
      this.adminMentorRepo.findAllMentors({ ...filter, $skip: skip, $limit: limit }),
      this.adminMentorRepo.countMentors(filter)
    ]);

    return {
      data: mentors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async changeMentorStatus(id: string, status: string, email: string) {
    const mentor = await this.adminMentorRepo.updateMentorStatus(id, status);
    if (status === 'approved') {
      await sendMentorStatusChangeEmail(email, status);
    }
    return mentor;
  }

  async toggleMentorBlock(id: string, isBlock: boolean) {
    return this.adminMentorRepo.blockMentor(id, isBlock);
  }
}