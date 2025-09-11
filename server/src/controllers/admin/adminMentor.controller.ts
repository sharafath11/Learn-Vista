import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.controller";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import {
  sendResponse,
  handleControllerError,
  throwError,
} from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
class AdminMentorController implements IAdminMentorController {
  constructor(
    @inject(TYPES.AdminMentorService)
    private _adminMentorService: IAdminMentorServices
  ) {}

  async getAllMentorsNotFiltering(req: Request, res: Response): Promise<void> {
    try {
      const mentors = await this._adminMentorService.getAllMentorWithoutFiltring();
      if (!mentors) throwError("Something went wrong");
      sendResponse(res, StatusCode.OK, Messages.MENTOR.FETCHED, true, mentors);
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
          sort[key] =
            value === "asc" || value === "1" || value === 1 ? 1 : -1;
        }
      } else {
        sort.createdAt = -1;
      }

      const result = await this._adminMentorService.getAllMentors(
        page,
        limit,
        search,
        queryParams.filters,
        sort
      );

      sendResponse(res, StatusCode.OK, Messages.MENTOR.FETCHED, true, {
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
      const mentorId = req.params.mentorId;
      const { status, email } = req.body;

      if (!mentorId || status === undefined || !email) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          Messages.MENTOR.CHANGE_STATUS_MISSING,
          false
        );
      }

      await this._adminMentorService.changeMentorStatus(mentorId, status, email);
      sendResponse(
        res,
        StatusCode.OK,
        Messages.MENTOR.STATUS_UPDATED(status),
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
          Messages.MENTOR.CHANGE_STATUS_MISSING,
          false
        );
      }

      const result = await this._adminMentorService.toggleMentorBlock(
        mentorId,
        isBlock
      );

      if (!result) {
        throwError(
          Messages.MENTOR.BLOCK_FAILED,
          StatusCode.BAD_REQUEST
        );
      }

      sendResponse(
        res,
        StatusCode.OK,
        Messages.MENTOR.BLOCK_UPDATED(result.username, isBlock),
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
          Messages.MENTOR.ID_REQUIRED,
          false
        );
      }

      const mentor = await this._adminMentorService.mentorDetails(id);

      if (!mentor) {
        throwError(Messages.MENTOR.NOT_FOUND, StatusCode.NOT_FOUND);
      }

      sendResponse(
        res,
        StatusCode.OK,
        Messages.MENTOR.FETCHED,
        true,
        mentor
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminMentorController;
