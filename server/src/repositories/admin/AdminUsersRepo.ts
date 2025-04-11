import { injectable } from "inversify";
// import { IAdminUsersRepository } from "../../core/interfaces/admin/IAdminUsersRepository";
import { IAdminUsersRepository } from "../../core/interfaces/repositories/admin/IAdminUsersRepository";
// import { IUser } from "../../models/User";
import { userModel } from "../../models/user/userModel";
import { BaseRepository } from "../BaseRepository";
import { IUser } from "../../types/userTypes";

@injectable()
export class AdminUsersRepo extends BaseRepository<IUser, IUser> implements IAdminUsersRepository {
  constructor() {
    super(userModel);
  }
  
  // Additional admin-specific methods can be added here
}