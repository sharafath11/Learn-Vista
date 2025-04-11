import { FilterQuery } from "mongoose";
import { IUser } from "../../../../types/userTypes";

export interface IAdminUsersRepository {
  findAll(filter?: FilterQuery<IUser>): Promise<IUser[]>;
  update(id: string, data: any): Promise<IUser | null>;
  // Add other methods as needed
}