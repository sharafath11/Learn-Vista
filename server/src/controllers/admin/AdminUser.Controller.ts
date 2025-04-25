import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";

@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(
    @inject(TYPES.AdminUsersService) private adminUserService: IAdminUserServices
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminUserService.getAllUsers();
      sendResponse(res, 200, "User get success", true, result);
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }

  async userBlock(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;

      if (!id || typeof status !== "boolean") {
        return sendResponse(res, 400, "Invalid request", false);
      }

      await this.adminUserService.blockUserServices(id, status);
      sendResponse(res, 200, "Status changed", true);
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }
}

export default AdminUserController;
