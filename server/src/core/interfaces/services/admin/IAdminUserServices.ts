import { ObjectId } from 'mongoose';
import { IUser } from '../../../../types/userTypes';


export interface IAdminUserServices {
  getAllUsers(): Promise<IUser[]>;
  blockUserServices(id:ObjectId,status:boolean):void
}