import { inject, injectable } from "inversify";
import { ObjectId } from "mongoose";
// import { IAdminUsersRepository } from "../../core/interfaces/admin/IAdminUsersRepository";
import { IAdminUsersRepository } from "../../core/interfaces/repositories/admin/IAdminUsersRepository";
import { TYPES } from "../../core/types";
import { IUser } from "../../types/userTypes";

@injectable()
export class AdminUsersServices {
  constructor(
    @inject(TYPES.AdminUsersRepository)
    private adminUsersRepo: IAdminUsersRepository
  ) {}

  async getAllUsers() {
    try {
      const users:IUser[] = await this.adminUsersRepo.findAll();
      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async blockUserServices(id: ObjectId, status: boolean) {
    try {
      const updatedUser = await this.adminUsersRepo.update(id.toString(), { isBlocked: status });
  
      if (!updatedUser) {
        return { ok: false, msg: "User not found" };
      }
  
      return { 
        ok: true, 
        data: updatedUser,
        msg: `User ${status ? "Blocked" : "Unblocked"} successfully` 
      };
    } catch (error: any) {
      console.error("Error blocking/unblocking user:", error.message);
      throw new Error("Failed to update user status");
    }
  }
}

export default AdminUsersServices;