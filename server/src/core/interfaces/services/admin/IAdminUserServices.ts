import { ObjectId } from 'mongoose';
import { IUser } from '../../../../types/userTypes';


export interface IAdminUserServices {
  getAllUsers(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: IUser[]; total: number; totalPages?: number }>;
  blockUserServices(id:ObjectId,status:boolean):void
}