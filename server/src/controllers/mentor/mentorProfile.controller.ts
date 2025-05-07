import { Request, Response } from "express";
import { IMentorProfileController } from "../../core/interfaces/controllers/mentor/IMentorProfile.controller";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { validateMentorProfile } from "../../validation/mentorValidation";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class MentorProfileController implements IMentorProfileController {
  constructor(
    @inject(TYPES.MentorProfileService) private mentorProfileService: IMentorProfileService
  ) {}

  async editProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username, bio } = req.body;
      const decoded = decodeToken(req.cookies.token);

      if (!decoded || decoded.role !== "mentor") {
        return sendResponse(res, StatusCode.UNAUTHORIZED, "Unauthorized", false);
      }

      validateMentorProfile({
        username,
        bio,
        image: req.file || undefined
      });

      const updatedData = await this.mentorProfileService.editProfile(
        username,
        bio,
        req.file?.buffer,
        decoded.id as string
      );

      return sendResponse(res, StatusCode.OK, "Profile updated successfully", true, updatedData);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
