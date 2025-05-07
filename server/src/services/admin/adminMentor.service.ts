import { inject, injectable } from "inversify";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { IMentor } from "../../types/mentorTypes";
import { throwError } from "../../utils/ResANDError";  
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class AdminMentorService implements IAdminMentorServices {
  constructor(
    @inject(TYPES.AdminMentorRepository)
    private adminMentorRepo: IAdminMentorRepository
  ) {}

  async getAllMentors(): Promise<IMentor[]> {
    const mentors = await this.adminMentorRepo.findAll();
    if (!mentors) throwError("Error fetching mentors", StatusCode.INTERNAL_SERVER_ERROR);
    return mentors;
  }

  async changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor | null> {
    const statusString = status ? "approved" : "rejected";

    const updated = await this.adminMentorRepo.update(id, { status });
    if (!updated) throwError(`Error changing mentor status for ID ${id}`, StatusCode.INTERNAL_SERVER_ERROR);

    if (updated && status) {
      await sendMentorStatusChangeEmail(email, statusString);
    }

    return updated;
  }

  async toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor | null> {
    const updated = await this.adminMentorRepo.update(id, { isBlock });
    if (!updated) throwError(`Error toggling block status for mentor ${id}`, StatusCode.INTERNAL_SERVER_ERROR);
    return updated;
  }

  async mentorDetils(id: string): Promise<IMentor> {
    const mentor = await this.adminMentorRepo.findById(id);
    if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
    return mentor;
  }
}
