import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { TYPES } from "../../core/types";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminCourseController implements IAdminCourseController {
  constructor(
    @inject(TYPES.AdminCourseService) private adminCourseServices: IAdminCourseServices
  ) {}

  async addCategories(req: Request, res: Response): Promise<void> {
    try {
      const { title, discription } = req.body;

      if (!title || !discription) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Title and description are required", false);
      }

      const data = await this.adminCourseServices.addCategories(title, discription);
      sendResponse(res, StatusCode.OK, "Category added successfully", true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminCourseServices.getCategory();
      sendResponse(res, StatusCode.OK, "Categories retrieved successfully", true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCategorie(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;
      await this.adminCourseServices.blockCategory(id, status);
      sendResponse(res, StatusCode.OK, `Category status updated successfully`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const thumbnail = req.file;

      if (!thumbnail) throwError("Thumbnail image is required", StatusCode.BAD_REQUEST);

      const result = await this.adminCourseServices.createClass(data, thumbnail.buffer);
      sendResponse(res, StatusCode.OK, "Course created successfully", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getCourse(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.adminCourseServices.getClass();
      if (!courses) throwError("Something went wrong", StatusCode.INTERNAL_SERVER_ERROR);
      sendResponse(res, StatusCode.OK, "Courses retrieved successfully", true, courses);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockCourses(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.body;
      await this.adminCourseServices.blockCourse(id, status);
      sendResponse(res, StatusCode.OK, `Course status updated to ${status}`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminCourseController;
