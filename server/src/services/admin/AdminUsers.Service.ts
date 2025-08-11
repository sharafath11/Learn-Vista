import { inject, injectable } from "inversify";
import { ObjectId } from "mongoose";
import { TYPES } from "../../core/types";
import { IUser } from "../../types/userTypes";
import { throwError } from "../../utils/ResANDError";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { StatusCode } from "../../enums/statusCode.enum";  
import { FilterQuery } from "mongoose";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository";
import { ICertificate } from "../../types/certificateTypes";
import { convertSignedUrlInArray, convertSignedUrlInObject, getSignedS3Url } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { UserMapper } from "../../shared/dtos/user/user.mapper";
import { IAdminUserCertificate, IAdminUserResponseDto } from "../../shared/dtos/user/user-response.dto";

@injectable()
export class AdminUsersServices implements IAdminUserServices {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepo: IUserRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.CertificateRepository) private _certificateRepo:ICertificateRepository
  ) {}

  async getAllUsers(
    page: number = 1,
    limit?: number,
    search?: string,
    filters: FilterQuery<IUser> = {},
    sort: Record<string, 1 | -1> = { username: -1 }
  ): Promise<{ data: IAdminUserResponseDto[]; total: number; totalPages?: number }> {

      const { data, total, totalPages } = await this._userRepo.findPaginated(
        filters,
        page,
        limit,
        search,
        sort
      );
      if (!data) {
        throwError(Messages.USERS.FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
      }
    const userData = await convertSignedUrlInArray(data, ["profilePicture"])
    const sendData=userData.map((i)=>UserMapper.toResponsAdminUsereDto(i))
      return { 
        data:sendData, 
        total,
        ...(totalPages !== undefined && { totalPages }) 
      };
   
  }
  
  async blockUserServices(id: ObjectId, status: boolean): Promise<{ ok: boolean; msg: string; data?: IUser }> {
    const updatedUser = await this._userRepo.update(id.toString(), { isBlocked: status });
    if (!updatedUser) {
      throwError(Messages.USERS.USER_NOT_FOUND, StatusCode.NOT_FOUND); 
    }
   await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id.toString()],
    title: Messages.USERS.BLOCK_TITLE(status),
    message: Messages.USERS.BLOCK_MESSAGE(status),
    type: status ? "error" : "success",
    });
    const sendData = await convertSignedUrlInObject(updatedUser,["profilePicture"])
    return {
      ok: true,
      data: sendData,
      msg: Messages.USERS.BLOCK_STATUS_UPDATED_NOT(status)
    };

  }
  async revokCertificate(certificateId: string | ObjectId, isRevocked: boolean): Promise<void> {
    await this._certificateRepo.update(certificateId as string,{isRevoked:isRevocked})
  }
  async getCertifcate(userId: string | ObjectId): Promise<IAdminUserCertificate[]> {
    const result = await this._certificateRepo.findAll({ userId })
    const sendData = result.map((i) => UserMapper.toResponsAdminUserCertificateDto(i));
    return sendData
  }
}

export default AdminUsersServices;
