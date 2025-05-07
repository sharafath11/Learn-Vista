import { inject, injectable } from "inversify";
import { ObjectId } from "mongoose";
import { IAdminUsersRepository } from "../../core/interfaces/repositories/admin/IAdminUsersRepository";
import { TYPES } from "../../core/types";
import { IUser } from "../../types/userTypes";
import { throwError } from "../../utils/ResANDError";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { StatusCode } from "../../enums/statusCode.enum";  

@injectable()
export class AdminUsersServices implements IAdminUserServices {
  constructor(
    @inject(TYPES.AdminUsersRepository)
    private adminUsersRepo: IAdminUsersRepository
  ) {}

  async getAllUsers(page: number): Promise<{ data: IUser[]; total: number }> {
    const { data, total } = await this.adminUsersRepo.findPaginated({}, page);
    if (!data) throwError("Error fetching users", StatusCode.INTERNAL_SERVER_ERROR);
    return { data, total };
  }
  

  async blockUserServices(id: ObjectId, status: boolean): Promise<{ ok: boolean; msg: string; data?: IUser }> {
    const updatedUser = await this.adminUsersRepo.update(id.toString(), { isBlocked: status });
    if (!updatedUser) {
      throwError("User not found", StatusCode.NOT_FOUND); 
    }

    return {
      ok: true,
      data: updatedUser,
      msg: `User ${status ? "Blocked" : "Unblocked"} successfully`
    };
  }
}

export default AdminUsersServices;
