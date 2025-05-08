import { inject, injectable } from "inversify";
import { IAdminMentorRepository } from "../../core/interfaces/repositories/admin/IAdminMentorRepository";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { IMentor } from "../../types/mentorTypes";
import { throwError } from "../../utils/ResANDError";  
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";

@injectable()
export class AdminMentorService implements IAdminMentorServices {
  constructor(
    @inject(TYPES.AdminMentorRepository)
    private adminMentorRepo: IAdminMentorRepository
  ) {}

  async getAllMentors(
    page: number = 1,
    limit?: number,
    search?: string,
    filters: FilterQuery<IMentor> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: IMentor[]; total: number; totalPages?: number }> {
    const { data, total, totalPages } = await this.adminMentorRepo.findPaginated(
      filters,
      page,
      limit,
      search,
      sort
    );
  
    if (!data) {
      throwError("Error fetching mentors", StatusCode.INTERNAL_SERVER_ERROR);
    }
  
    return {
      data,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
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

  async mentorDetails(id: string): Promise<IMentor> {
    const mentor = await this.adminMentorRepo.findById(id);
    if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
    return mentor;
  }
}
