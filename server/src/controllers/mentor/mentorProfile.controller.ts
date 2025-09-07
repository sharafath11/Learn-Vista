import { Request, Response } from "express";
import { IMentorProfileController } from "../../core/interfaces/controllers/mentor/IMentorProfile.controller";
import { decodeToken } from "../../utils/JWTtoken";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
import { validateMentorProfile } from "../../validation/mentorValidation";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
export class MentorProfileController implements IMentorProfileController {
  constructor(
    @inject(TYPES.MentorProfileService) private _mentorProfileService: IMentorProfileService
  ) {}

 async editProfile(req: Request, res: Response): Promise<void> {
  try {
    const { username, bio, expertise } = req.body;
    const decoded = decodeToken(req.cookies.token);

    if (!decoded || decoded.role !== "mentor") {
      return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.COMMON.UNAUTHORIZED, false);
    }

    validateMentorProfile({
      username,
      bio,
      image: req.file || undefined,
    });

    const updatedData = await this._mentorProfileService.editProfile(
      username,
      bio,
      req.file?.buffer,
      expertise,
      decoded.id as string
    );

    return sendResponse(res, StatusCode.OK, Messages.PROFILE.PROFILE_UPDATED, true, updatedData);
  } catch (error) {
    handleControllerError(res, error);
  }
}

  async changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return sendResponse(
        res,
        StatusCode.BAD_REQUEST,
        Messages.COMMON.MISSING_FIELDS,
        false
      );
    }

    const decoded = decodeToken(req.cookies.token);
    if (!decoded) {
      throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.UNAUTHORIZED);
    }

    await this._mentorProfileService.changePassword(
      decoded.id,
      password,
      newPassword
    );

    sendResponse(
      res,
      StatusCode.OK,
      Messages.AUTH.CHANGE_PASSWORD,
      true
    );
  } catch (error) {
    handleControllerError(res, error);
  }
}

}
