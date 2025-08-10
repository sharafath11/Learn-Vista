import { ObjectId } from 'mongoose';
import { IUser } from '../../../../types/userTypes';
import { ICertificate } from '../../../../types/certificateTypes';
import { AdminUserCertificate, AdminUserResponseDto } from '../../../../shared/dtos/user/user-response.dto';


export interface IAdminUserServices {
  getAllUsers(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: AdminUserResponseDto[]; total: number; totalPages?: number }>;
  blockUserServices(id: ObjectId, status: boolean): void
  getCertifcate(userId: string|ObjectId): Promise<AdminUserCertificate[]>
  revokCertificate(certificateId:string|ObjectId,isRevocked:boolean):Promise<void>
}