import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import {
  sendResponse,
  handleControllerError,
  throwError,
} from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminMentorController implements IAdminMentorController {
  constructor(
    @inject(TYPES.AdminMentorService)
    private adminMentorService: IAdminMentorServices
  ) {}
  async getAllMentorsNotFiltering(req: Request, res: Response): Promise<void> {
    try {
      const mentor =
        await this.adminMentorService.getAllMentorWithoutFiltring();
      if (!mentor) throwError("Somthing wronet weronfg");
      sendResponse(res, StatusCode.OK, "", true, mentor);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async getAllMentors(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = (req.query as any).params || req.query;

      const page = Math.max(Number(queryParams.page) || 1, 1);
      const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
      const search = queryParams.search?.toString() || "";
      const sort: Record<string, 1 | -1> = {};

      if (queryParams.sort) {
        for (const key in queryParams.sort) {
          const value = queryParams.sort[key];
          if (value === "asc" || value === "1" || value === 1) {
            sort[key] = 1;
          } else if (value === "desc" || value === "-1" || value === -1) {
            sort[key] = -1;
          } else {
           
            sort[key] = -1;
          }
        }
      } else {
        sort.createdAt = -1;
      }

      const result = await this.adminMentorService.getAllMentors(
        page,
        limit,
        search,
        queryParams.filters,
        sort
      );

      sendResponse(res, StatusCode.OK, "Mentor fetched successfully", true, {
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

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, status, email } = req.body;

      if (!mentorId || status === undefined || !email) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          "mentorId, status, and email are required",
          false
        );
      }

      await this.adminMentorService.changeMentorStatus(mentorId, status, email);
      sendResponse(
        res,
        StatusCode.OK,
        `Mentor status changed to ${status}`,
        true
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockMentor(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, isBlock } = req.body;

      if (!mentorId || isBlock === undefined) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          "mentorId and isBlock are required",
          false
        );
      }

      const result = await this.adminMentorService.toggleMentorBlock(
        mentorId,
        isBlock
      );

      if (!result) {
        throwError(
          "Something went wrong while updating mentor status",
          StatusCode.BAD_REQUEST
        );
      }

      sendResponse(
        res,
        StatusCode.OK,
        `${result.username} ${isBlock ? "Blocked" : "Unblocked"} successfully`,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async mentorDetils(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          "Mentor ID is required",
          false
        );
      }

      const mentor = await this.adminMentorService.mentorDetails(id);

      if (!mentor) {
        throwError("Mentor not found", StatusCode.NOT_FOUND);
      }

      sendResponse(
        res,
        StatusCode.OK,
        "Mentor fetched successfully",
        true,
        mentor
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminMentorController;
