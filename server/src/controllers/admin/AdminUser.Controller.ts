import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminUserController implements IAdminUserController {
  constructor(
    @inject(TYPES.AdminUsersService)
    private adminUserService: IAdminUserServices
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page=Number(req.params.page)
      const result = await this.adminUserService.getAllUsers(page);
      sendResponse(res, StatusCode.OK, "Users fetched successfully", true, result);
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
