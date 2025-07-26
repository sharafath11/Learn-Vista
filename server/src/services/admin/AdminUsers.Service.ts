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
import { convertSignedUrlInArray } from "../../utils/s3Utilits";

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
  ): Promise<{ data: IUser[]; total: number; totalPages?: number }> {

      const { data, total, totalPages } = await this._userRepo.findPaginated(
        filters,
        page,
        limit,
        search,
        sort
      );
      
      if (!data) {
        throwError("Error fetching users", StatusCode.INTERNAL_SERVER_ERROR);
      }
      const userData=await convertSignedUrlInArray(data,["profilePicture"])
      return { 
        data:userData, 
        total,
        ...(totalPages !== undefined && { totalPages }) 
      };
   
  }
  
  async blockUserServices(id: ObjectId, status: boolean): Promise<{ ok: boolean; msg: string; data?: IUser }> {
    const updatedUser = await this._userRepo.update(id.toString(), { isBlocked: status });
    if (!updatedUser) {
      throwError("User not found", StatusCode.NOT_FOUND); 
    }
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id.toString()],
    title: status ? " Account Blocked" : "Account Unblocked",
    message: `Your account has been ${status ? "blocked" : "unblocked"} by the admin.`,
    type: status ? "error" : "success",
  });
    return {
      ok: true,
      data: updatedUser,
      msg: `User ${status ? "Blocked" : "Unblocked"} successfully`
    };

  }
  async revokCertificate(certificateId: string | ObjectId, isRevocked: boolean): Promise<void> {
    await this._certificateRepo.update(certificateId as string,{isRevoked:isRevocked})
  }
  async getCertifcate(userId: string | ObjectId): Promise<ICertificate[]> {
    return await this._certificateRepo.findAll({userId})
  }
}

export default AdminUsersServices;
