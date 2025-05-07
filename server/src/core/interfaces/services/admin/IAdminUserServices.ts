import { ObjectId } from 'mongoose';
import { IUser } from '../../../../types/userTypes';


export interface IAdminUserServices {
  getAllUsers(page: number): Promise<{ data: IUser[]; total: number }>;
  blockUserServices(id:ObjectId,status:boolean):void
}