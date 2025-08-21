import { ObjectId } from 'mongoose';
import { IAdminUserCertificate, IAdminUserResponseDto } from '../../../../shared/dtos/user/user-response.dto';


export interface IAdminUserServices {
  getAllUsers(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: IAdminUserResponseDto[]; total: number; totalPages?: number }>;
  blockUserServices(id: ObjectId, status: boolean): void
  getCertifcate(userId: string|ObjectId): Promise<IAdminUserCertificate[]>
  revokCertificate(certificateId:string|ObjectId,isRevocked:boolean):Promise<void>
}