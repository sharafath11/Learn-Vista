import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";
import { sendResponse, handleControllerError } from "../../utils/ResANDError";

@injectable()
export class AdminMentorController implements IAdminMentorController {
  constructor(
    @inject(TYPES.AdminMentorService)
    private adminMentorService: IAdminMentorServices
  ) {}

  async getAllMentors(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminMentorService.getAllMentors();
      sendResponse(res, 200, "Mentors fetched successfully", true, result);
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, status, email } = req.body;

      await this.adminMentorService.changeMentorStatus(
        mentorId,
        status,
        email
      );

      sendResponse(res, 200, `Mentor status changed to ${status}`, true);
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }

  async blockMentor(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId, isBlock } = req.body;
      const result = await this.adminMentorService.toggleMentorBlock(
        mentorId,
        isBlock
      );

      if (!result) {
        throw new Error("Something went wrong while blocking/unblocking mentor");
      }

      sendResponse(
        res,
        200,
        `${result.username} ${isBlock ? "Blocked" : "Unblocked"} successfully`,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }

  async mentorDetils(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const mentor = await this.adminMentorService.mentorDetils(id);

      if (!mentor) {
        throw new Error("Mentor not found");
      }

      sendResponse(res, 200, "Mentor fetched successfully", true, mentor);
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }
}

export default AdminMentorController;
