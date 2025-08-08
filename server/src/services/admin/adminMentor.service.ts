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
import { Messages } from "../../constants/messages";

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
      throwError(Messages.MENTOR.FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
     const sendData=await convertSignedUrlInArray(data,["profilePicture","cvOrResume"])
  
    return {
      data:sendData,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  

  async changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor | null> {
      const statusString = status ? Messages.MENTOR.STATUS_APPROVED : Messages.MENTOR.STATUS_REJECTED;
    const updated = await this._mentorRepo.update(id, { status });
    if (!updated) {
      throwError(Messages.MENTOR.STATUS_CHANGE_FAILED(id), StatusCode.INTERNAL_SERVER_ERROR);
    }

    if (updated && status) {
      await sendMentorStatusChangeEmail(email, statusString);
    }
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [updated.userId as unknown as string],
    title: status
      ? Messages.MENTOR.APPROVED_TITLE
      : Messages.MENTOR.REJECTED_TITLE,
    message: status
      ? Messages.MENTOR.APPROVED_MESSAGE
      : Messages.MENTOR.REJECTED_MESSAGE,
    type: status ? "success" : "error",
  });
    return updated;
  }

  async toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor | null> {
    const updated = await this._mentorRepo.update(id, { isBlock });
    if (!updated) {
      throwError(Messages.MENTOR.BLOCK_TOGGLE_FAILED(id), StatusCode.INTERNAL_SERVER_ERROR);
    }
  const statusText = Messages.MENTOR.BLOCK_STATUS_TEXT(isBlock);
   await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id],
    title: Messages.MENTOR.BLOCK_TITLE(statusText),
    message: Messages.MENTOR.BLOCK_MESSAGE(statusText),
    type: isBlock ? "error" : "success",
  });
    return updated;
  }

  async mentorDetails(id: string): Promise<IMentor> {
    const mentor = await this._mentorRepo.findById(id);
    if (!mentor) {
      throwError(Messages.MENTOR.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    const sendData = await convertSignedUrlInObject(mentor, ["profilePicture","cvOrResume"]);
    return sendData;
  }
}
