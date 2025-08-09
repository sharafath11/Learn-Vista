import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
class AdminCourseController implements IAdminCourseController {
  constructor(
    @inject(TYPES.AdminCourseService)
    private _adminCourseServices: IAdminCourseServices
  ) {}

  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const thumbnail = req.file;
      if (!thumbnail) throwError("Thumbnail image is required", StatusCode.BAD_REQUEST);

      const result = await this._adminCourseServices.createClass(data, thumbnail.buffer);
      sendResponse(res, StatusCode.OK, Messages.COURSE.CREATED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const courseId = req.params.courseId;
      const thumbnailBuffer = req.file?.buffer;
      delete data.thumbnail;

      if (!courseId) {
        return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COURSE.MISSING_ID, false);
      }

      const result = await this._adminCourseServices.editCourseService(courseId, data, thumbnailBuffer);
      sendResponse(res, StatusCode.OK, Messages.COURSE.UPDATED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getCourse(req: Request, res: Response): Promise<void> {
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
        sort.createdAt = 1;
      }

      const sendFilter: any = {};
      if (queryParams.filters?.isBlocked !== undefined) {
        sendFilter.isBlock = queryParams.filters.isBlocked === "false" ? false : true;
      }

      const courses = await this._adminCourseServices.getClass(page, limit, search, sendFilter, sort);
      sendResponse(res, StatusCode.OK, Messages.COURSE.FETCHED, true, courses);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCourses(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.id;
      const { status } = req.body;
      await this._adminCourseServices.blockCourse(courseId, status);
      sendResponse(res, StatusCode.OK, Messages.COURSE.STATUS_UPDATED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getLessons(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const result = await this._adminCourseServices.getLessons(courseId as string);
      sendResponse(res, StatusCode.OK, Messages.COURSE.LESSONS_FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminCourseController;
