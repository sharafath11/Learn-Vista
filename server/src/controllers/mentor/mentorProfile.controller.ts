import { Request, Response } from "express";
import { IMentorProfileController } from "../../core/interfaces/controllers/mentor/IMentorProfile.controller";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { validateMentorProfile } from "../../validation/mentorValidation";

@injectable()
export class MentorProfileController implements IMentorProfileController {
  constructor(
    @inject(TYPES.MentorProfileService) private mentorProfileService: IMentorProfileService
  ) {
    console.log("MentorProfileService injected?", this.mentorProfileService !== undefined);
  }

  async editProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username, bio } = req.body;
      const decode = decodeToken(req.cookies.token);
      validateMentorProfile({
        username,
        bio,
        image: req.file || undefined
      });
      
      if (!decode || decode.role !== "mentor") {
        throwError("Unauthorized");
      }

      const data = await this.mentorProfileService.editProfile(username, bio, req.file?.buffer, decode?.id as string);
      sendResponse(res, 200, "Profile updated successfully", true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
