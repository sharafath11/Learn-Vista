import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminCategoryController } from "../../core/interfaces/controllers/admin/IAdminCategory.controller";
import { TYPES } from "../../core/types";
import { handleControllerError, sendResponse } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { validateCategory } from "../../validation/adminValidation";
import { IAdminCategoryService } from "../../core/interfaces/services/admin/IAdminCategoryService";
import { Messages } from "../../constants/messages";

@injectable()
class AdminCategoryController implements IAdminCategoryController {
  constructor(
    @inject(TYPES.AdminCategoryService)
    private _adminCategoryService: IAdminCategoryService
  ) {}

async addCategory(req: Request, res: Response): Promise<void> {
  try {
    const { title, discription } = req.body;
    const data = await this._adminCategoryService.addCategory(title, discription);
    sendResponse(res, StatusCode.OK, Messages.CATEGORY.CREATED, true, data);
  } catch (error) {
    handleControllerError(res, error);
  }
}


  async editCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { title, discription } = req.body;
      const validationError = validateCategory(title, discription);

      if (validationError || !id || !title || !discription) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          validationError || Messages.CATEGORY.MISSING_FIELDS,
          false
        );
      }

      const result = await this._adminCategoryService.editCategory(
        id,
        title,
        discription
      );
      sendResponse(res, StatusCode.OK, Messages.CATEGORY.UPDATED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;
      const page = Math.max(Number(queryParams.page) || 1, 1);
      const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
      const search = queryParams.search?.toString() || "";
      const sort: Record<string, 1 | -1> = {};

      if (queryParams.sort) {
        for (const key in queryParams.sort) {
          const value = queryParams.sort[key];
          sort[key] = value === "asc" || value === "1" || value === 1 ? 1 : -1;
        }
      } else {
        sort.createdAt = -1;
      }

      const data = await this._adminCategoryService.getCategories(
        page,
        limit,
        search,
        queryParams.filters,
        sort
      );

      sendResponse(res, StatusCode.OK, Messages.CATEGORY.RETRIEVED, true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._adminCategoryService.getAllCategories();
      sendResponse(res, StatusCode.OK, Messages.CATEGORY.FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { status } = req.body;
      await this._adminCategoryService.blockCategory(id, status);
      sendResponse(res, StatusCode.OK, Messages.CATEGORY.STATUS_UPDATED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminCategoryController;
