import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { IAdminConcernController } from "../../core/interfaces/controllers/admin/IAdminConcern.Controller";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IAdminConcernService } from "../../core/interfaces/services/admin/IAdminConcernService";

@injectable()
class AdminConcernController implements IAdminConcernController {
  constructor(
    @inject(TYPES.AdminConcernService) private _adminCourseServices: IAdminConcernService
  ) {}

  async getConcernController(req: Request, res: Response): Promise<void> {
    try {
      const concerns = await this._adminCourseServices.getConcern();
      sendResponse(res, StatusCode.OK, "Concerns fetched successfully", true, concerns);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async updateConcernStatus(req: Request, res: Response): Promise<void> {
    try {
      const concernId = req.params.id;
      const { status, resolution } = req.body;

      if (!["resolved", "in-progress"].includes(status)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Invalid status", false);
      }

      if (!resolution || resolution.trim().length < 10) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Resolution must be at least 10 characters", false);
      }

      await this._adminCourseServices.updateConcernStatus(concernId, status, resolution);
      sendResponse(res, StatusCode.OK, "Concern status updated", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getAllConcerns(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;
      const page = Math.max(Number(queryParams.page) || 1, 1);
      const limit = Math.min(Math.max(Number(queryParams.limit) || 6, 1), 100);
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

      const filters = queryParams.filters || {};
      const filterQuery: any = {};
      if (filters.status && filters.status !== "All") {
        filterQuery.status = filters.status;
      }
      if (filters.courseId && filters.courseId !== "All") {
        filterQuery.courseId = filters.courseId;
      }
      if (search) {
        filterQuery.$or = [
          { title: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this._adminCourseServices.getAllConcerns({ ...filterQuery, search }, limit, skip, sort),
        this._adminCourseServices.countAllConcerns({ ...filterQuery, search }),
      ]);

      const totalPages = Math.ceil(total / limit);

      sendResponse(res, StatusCode.OK, "Concerns fetched successfully", true, {
        data,
        total,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminConcernController;
