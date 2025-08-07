import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IUserFilterParams } from "../../types/adminTypes";
import { Messages } from "../../constants/messages";

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
      const search = queryParams.search?.toString() || "";

      const filters: IUserFilterParams = {
        ...(queryParams.filters?.isActive && { isActive: queryParams.filters.isActive === "true" }),
        ...(queryParams.filters?.isBlocked && { isBlocked: queryParams.filters.isBlocked === "true" }),
        ...(queryParams.filters?.role && { role: queryParams.filters.role.toString() }),
      };

      const sort: Record<string, 1 | -1> = {};
      if (queryParams.sort) {
        for (const key in queryParams.sort) {
          const value = queryParams.sort[key];
          sort[key] = value === "asc" || value === "1" || value === 1 ? 1 : -1;
        }
      } else {
        sort.createdAt = -1;
      }

      const result = await this.adminUserService.getAllUsers(page, limit, search, filters, sort);

      sendResponse(res, StatusCode.OK, Messages.USERS.FETCHED, true, {
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

  async getCertificate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!userId) throwError(Messages.USERS.MISSING_USER_ID, StatusCode.BAD_REQUEST);

      const result = await this.adminUserService.getCertifcate(userId);
      sendResponse(res, StatusCode.OK, Messages.CERTIFICATES.FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async revokCertificate(req: Request, res: Response): Promise<void> {
    try {
      const certificateId = req.params.certificateId;
      const { isRevoked } = req.body;

      if (!certificateId || typeof isRevoked !== "boolean") {
        throwError(Messages.CERTIFICATES.MISSING_DATA, StatusCode.BAD_REQUEST);
      }

      await this.adminUserService.revokCertificate(certificateId, isRevoked);

      const message = isRevoked
        ? Messages.CERTIFICATES.REVOKED
        : Messages.CERTIFICATES.UNREVOKED;

      sendResponse(res, StatusCode.OK, message, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async userBlock(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;

      if (!id || typeof status !== "boolean") {
        throwError(Messages.USERS.MISSING_BLOCK_DATA, StatusCode.BAD_REQUEST);
      }

      await this.adminUserService.blockUserServices(id, status);
      sendResponse(res, StatusCode.OK, Messages.USERS.BLOCK_STATUS_UPDATED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminUserController;
