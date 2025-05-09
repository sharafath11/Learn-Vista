import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IUserFilterParams } from "../../types/adminTypes";

@injectable()
class AdminUserController implements IAdminUserController {
  constructor(
    @inject(TYPES.AdminUsersService)
    private adminUserService: IAdminUserServices
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;
  
      const page = Math.max(Number(queryParams.page) || 1, 1);
      const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
      const search = queryParams.search?.toString() || '';
  
  
      const filters: IUserFilterParams = {
        ...(queryParams.filters?.isActive && { isActive: queryParams.filters.isActive === 'true' }),
        ...(queryParams.filters?.isBlocked && { isBlocked: queryParams.filters.isBlocked === 'true' }),
        
        ...(queryParams.filters?.role && { role: queryParams.filters.role.toString() }),
      };
  
      
      const sort: Record<string, 1 | -1> = {};
      console.log("queryParams.sort", queryParams.sort);
  
      if (queryParams.sort) {
        for (const key in queryParams.sort) {
          const value = queryParams.sort[key];
          if (value === 'asc' || value === '1' || value === 1) {
            sort[key] = 1;
          } else if (value === 'desc' || value === '-1' || value === -1) {
            sort[key] = -1;
          } else {
            console.warn(`Invalid sort value for ${key}: ${value}, defaulting to -1`);
            sort[key] = -1;
          }
        }
       
      } else {
        sort.createdAt = -1;
      }
  
      console.log("sort in controller", sort);
  
      const result = await this.adminUserService.getAllUsers(
        page,
        limit,
        search,
        filters,
        sort
      );
  
  
      sendResponse(res, StatusCode.OK, "Users fetched successfully", true, {
        data: result.data,
        total: result.total,
        page,
        limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  
  
  async userBlock(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;

      if (!id || typeof status !== "boolean") {
        throwError("User ID and valid status (boolean) are required", StatusCode.BAD_REQUEST);
      }

      await this.adminUserService.blockUserServices(id, status);
      sendResponse(res, StatusCode.OK, "User status updated successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminUserController;
