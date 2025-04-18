
import { IUser } from "../../../../types/userTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IAdminUsersRepository extends  IBaseRepository <IUser, IUser> {
  
}