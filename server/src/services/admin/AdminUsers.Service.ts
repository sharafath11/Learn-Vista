import { inject, injectable } from "inversify";
import { ObjectId } from "mongoose";
import { IAdminUsersRepository } from "../../core/interfaces/repositories/admin/IAdminUsersRepository";
import { TYPES } from "../../core/types";
import { IUser } from "../../types/userTypes";
import { throwError } from "../../utils/ResANDError";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { StatusCode } from "../../enums/statusCode.enum";  
import { FilterQuery } from "mongoose";

@injectable()
export class AdminUsersServices implements IAdminUserServices {
  constructor(
    @inject(TYPES.AdminUsersRepository)
    private adminUsersRepo: IAdminUsersRepository
  ) {}

  async getAllUsers(
    page: number = 1,
    limit?: number,
    search?: string,
    filters: FilterQuery<IUser> = {},
    sort: Record<string, 1 | -1> = { username: -1 }
  ): Promise<{ data: IUser[]; total: number; totalPages?: number }> {
    console.log("sort service ",sort)
      const { data, total, totalPages } = await this.adminUsersRepo.findPaginated(
        filters,
        page,
        limit,
        search,
        sort
      );
      
      if (!data) {
        throwError("Error fetching users", StatusCode.INTERNAL_SERVER_ERROR);
      }
      
      return { 
        data, 
        total,
        ...(totalPages !== undefined && { totalPages }) 
      };
   
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
