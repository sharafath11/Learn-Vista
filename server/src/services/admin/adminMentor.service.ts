import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { IMentor } from "../../types/mentorTypes";
import { throwError } from "../../utils/resAndError";  
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { convertSignedUrlInArray, convertSignedUrlInObject} from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { MentorMapper} from "../../shared/dtos/mentor/mentor.mapper";
import { IAdminAddCourseMentorsDto, IAdminMentorResponseDto, IMentorResponseDto } from "../../shared/dtos/mentor/mentor-response.dto";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";

@injectable()
export class AdminMentorService implements IAdminMentorServices {
  constructor(
    @inject(TYPES.MentorRepository)
    private _mentorRepo: IMentorRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
    
  ) { }
  async getAllMentorWithoutFiltring(): Promise<IAdminAddCourseMentorsDto[]> {
    const result = await this._mentorRepo.findAll();
    const sendData = await convertSignedUrlInArray(result, ["profilePicture", "cvOrResume"]);
    const mentorDetails=sendData.map((i)=>MentorMapper.toAdminCourseMentorDet(i))
    return mentorDetails
  }

  async getAllMentors(
    page: number = 1,
    limit?: number,
    search?: string,
    filters: FilterQuery<IMentor> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data:  IAdminMentorResponseDto[]; total: number; totalPages?: number }> {
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
  const sendData = await convertSignedUrlInArray(data, ["profilePicture", "cvOrResume"]);


const mappingDatas = await Promise.all(
  sendData.map(async (mentor) => {
    const courses = await this._courseRepo.findAll({ mentorId: mentor._id });
    return MentorMapper.toResponseAdminDto(mentor, courses);
  })
);



  
    return {
      data:mappingDatas,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  

  async changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentorResponseDto | null> {
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
    return MentorMapper.toResponseDto(updated);
  }

  async toggleMentorBlock(id: string, isBlock: boolean): Promise<IAdminMentorResponseDto | null> {
    const updated = await this._mentorRepo.update(id, { isBlock });
    if (!updated) {
      throwError(Messages.MENTOR.BLOCK_TOGGLE_FAILED(id), StatusCode.INTERNAL_SERVER_ERROR);
    }
  const statusText = Messages.MENTOR.BLOCK_STATUS_TEXT(isBlock);
   await notifyWithSocket({
    notificationService: this._notificationService,
     userIds: [id.toString()],
    userId:id,
    title: Messages.MENTOR.BLOCK_TITLE(statusText),
    message: Messages.MENTOR.BLOCK_MESSAGE(statusText),
    type: isBlock ? "error" : "success",
   });
    const sendData=MentorMapper.toResponseAdminDto(updated)
    return sendData
  }

  async mentorDetails(id: string): Promise<IAdminMentorResponseDto> {
    const mentor = await this._mentorRepo.findById(id);
    if (!mentor) {
      throwError(Messages.MENTOR.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    const sendData = await convertSignedUrlInObject(mentor, ["profilePicture", "cvOrResume"]);
     const mentorDetails=MentorMapper.toResponseAdminDto(sendData)
    return mentorDetails

  }
}
