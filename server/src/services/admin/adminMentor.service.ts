import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { IMentor } from "../../types/mentorTypes";
import { throwError } from "../../utils/ResANDError";  
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { convertSignedUrlInArray, convertSignedUrlInObject, getSignedS3Url } from "../../utils/s3Utilits";

@injectable()
export class AdminMentorService implements IAdminMentorServices {
  constructor(
    @inject(TYPES.MentorRepository)
    private _mentorRepo: IMentorRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) { }
  async getAllMentorWithoutFiltring(): Promise<IMentor[]> {
    const result = await this._mentorRepo.findAll();
    const sendData=await convertSignedUrlInArray(result,["profilePicture","cvOrResume"])
    return sendData
  }

  async getAllMentors(
    page: number = 1,
    limit?: number,
    search?: string,
    filters: FilterQuery<IMentor> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: IMentor[]; total: number; totalPages?: number }> {
    const { data, total, totalPages } = await this._mentorRepo.findPaginated(
      filters,
      page,
      limit,
      search,
      sort
    );
  
    if (!data) {
      throwError("Error fetching mentors", StatusCode.INTERNAL_SERVER_ERROR);
    }
     const sendData=await convertSignedUrlInArray(data,["profilePicture","cvOrResume"])
  
    return {
      data:sendData,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  

  async changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor | null> {
    const statusString = status ? "approved" : "rejected";

    const updated = await this._mentorRepo.update(id, { status });
    if (!updated) throwError(`Error changing mentor status for ID ${id}`, StatusCode.INTERNAL_SERVER_ERROR);

    if (updated && status) {
      await sendMentorStatusChangeEmail(email, statusString);
    }
     await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [updated.userId as unknown as string],
    title: status
      ? "🎉 You're approved as a mentor!"
      : "⚠️ Your mentor request was rejected",
    message: status
      ? "Congratulations! Your mentor profile has been approved. You can now sign up and complete your onboarding on the Mentor Page."
      : "We're sorry to inform you that your mentor request was rejected by the admin.",
    type: status ? "success" : "error",
  });
    return updated;
  }

  async toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor | null> {
    const updated = await this._mentorRepo.update(id, { isBlock });
    if (!updated) throwError(`Error toggling block status for mentor ${id}`, StatusCode.INTERNAL_SERVER_ERROR);
    const statusText = isBlock ? "blocked" : "unblocked";
   await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id],
    title: ` Your account was ${statusText}`,
    message: `Your mentor account has been ${statusText} by the admin.`,
    type: isBlock ? "error" : "success",
  });
    return updated;
  }

  async mentorDetails(id: string): Promise<IMentor> {
    const mentor = await this._mentorRepo.findById(id);
    if (!mentor) throwError("Mentor not found", StatusCode.NOT_FOUND);
    const sendData = await convertSignedUrlInObject(mentor, ["profilePicture","cvOrResume"]);
    console.log(sendData,"datagdvkjbj")
    return sendData;
  }
}
