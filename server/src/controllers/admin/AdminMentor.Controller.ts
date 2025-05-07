import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { sendResponse, handleControllerError, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminMentorController implements IAdminMentorController {
  constructor(
    @inject(TYPES.AdminMentorService)
    private adminMentorService: IAdminMentorServices
  ) {}

  async getAllMentors(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminMentorService.getAllMentors();
      sendResponse(res, StatusCode.OK, "Mentors fetched successfully", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, status, email } = req.body;

      if (!mentorId || status === undefined || !email) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "mentorId, status, and email are required", false);
      }

      await this.adminMentorService.changeMentorStatus(mentorId, status, email);
      sendResponse(res, StatusCode.OK, `Mentor status changed to ${status}`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async blockMentor(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, isBlock } = req.body;

      if (!mentorId || isBlock === undefined) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "mentorId and isBlock are required", false);
      }

      const result = await this.adminMentorService.toggleMentorBlock(mentorId, isBlock);

      if (!result) {
        throwError("Something went wrong while updating mentor status", StatusCode.BAD_REQUEST);
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
        return sendResponse(res, StatusCode.BAD_REQUEST, "Mentor ID is required", false);
      }

      const mentor = await this.adminMentorService.mentorDetils(id);

      if (!mentor) {
        throwError("Mentor not found", StatusCode.NOT_FOUND);
      }

      sendResponse(res, StatusCode.OK, "Mentor fetched successfully", true, mentor);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminMentorController;
