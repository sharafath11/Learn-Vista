import { ObjectId } from 'mongoose';
import { IUser } from '../../../../types/userTypes';
import { ICertificate } from '../../../../types/certificateTypes';


export interface IAdminUserServices {
  getAllUsers(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: IUser[]; total: number; totalPages?: number }>;
  blockUserServices(id: ObjectId, status: boolean): void
  getCertifcate(userId: string|ObjectId): Promise<ICertificate[]>
  revokCertificate(certificateId:string|ObjectId,isRevocked:boolean):Promise<void>
}