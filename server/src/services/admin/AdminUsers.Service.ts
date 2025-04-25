import { inject, injectable } from "inversify";
import { ObjectId } from "mongoose";
import { IAdminUsersRepository } from "../../core/interfaces/repositories/admin/IAdminUsersRepository";
import { TYPES } from "../../core/types";
import { IUser } from "../../types/userTypes";
import { throwError } from "../../utils/ResANDError";  
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";

@injectable()
export class AdminUsersServices implements IAdminUserServices{
  constructor(
    @inject(TYPES.AdminUsersRepository)
    private adminUsersRepo: IAdminUsersRepository
  ) {}

  async getAllUsers(): Promise<IUser[]> {
    const users: IUser[] = await this.adminUsersRepo.findAll();
    if (!users) throwError("Error fetching users", 500);
    return users;
  }

  async blockUserServices(id: ObjectId, status: boolean): Promise<{ ok: boolean; msg: string; data?: IUser }> {
    const updatedUser = await this.adminUsersRepo.update(id.toString(), { isBlocked: status });
    if (!updatedUser) {
      throwError("User not found", 404);  
    }

    return { 
      ok: true, 
      data: updatedUser,
      msg: `User ${status ? "Blocked" : "Unblocked"} successfully`
    };
  }
}

export default AdminUsersServices;
