import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { validateMentorApplyInput } from "../../validation/userValidation";
import { IProfileController } from "../../core/interfaces/controllers/user/IProfileController";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { ISocialLink } from "../../types/mentorTypes";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { sendResponse, handleControllerError, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.ProfileService) private _profileService: IProfileService
  ) {}

  async applyMentor(req: Request, res: Response) {
    try {
      const { email, username, phoneNumber, expertise, socialLinks } = req.body;

      const { isValid, errorMessage } = validateMentorApplyInput(
        email, username, phoneNumber, req.file || null, expertise
      );
      if (!isValid) {
        return throwError(errorMessage as string, StatusCode.BAD_REQUEST);
      }

      if (!req.file) {
        return throwError(Messages.PROFILE.NO_FILE_UPLOADED, StatusCode.BAD_REQUEST);
      }

      let parsedExpertise: string[] = [];
      if (typeof expertise === "string") {
        try {
          parsedExpertise = JSON.parse(expertise); 
        } catch (error) {
          return throwError(Messages.PROFILE.INVALID_EXPERTISE_FORMAT, StatusCode.BAD_REQUEST);
        }
      } else {
        parsedExpertise = expertise; 
      }

      let parsedSocialLinks: ISocialLink[] = [];
      if (typeof socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(socialLinks); 
        } catch (error) {
          return throwError(Messages.PROFILE.INVALID_SOCIAL_LINKS_FORMAT, StatusCode.BAD_REQUEST);
        }
      } else {
        parsedSocialLinks = socialLinks;
      }

      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded?.id || decoded.role !== "user") {
        return throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      await this._profileService.applyMentor(
        email,
        username,
        req.file,
        parsedExpertise,
        decoded.id,
        phoneNumber,
        parsedSocialLinks
      );

      sendResponse(res, StatusCode.CREATED,Messages.PROFILE.APPLICATION_SUBMITTED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async editProfile(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const image = req.file?.buffer;

      if (username.trim().length < 6) {
        return throwError(Messages.PROFILE.USERNAME_TOO_SHORT, StatusCode.FORBIDDEN);
      }

      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      const result = await this._profileService.editProfileService(
        username, 
        image || undefined, 
        decoded.id
      );

      sendResponse(res, StatusCode.OK, Messages.PROFILE.PROFILE_UPDATED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async changePassword(req: Request, res: Response): Promise<void> {
   try {
     const { password, newPassword } = req.body;
     const decoded = decodeToken(req.cookies.token);
     if (!decoded) throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
     await this._profileService.changePassword(decoded?.id as string, password, newPassword);
     sendResponse(res,StatusCode.OK,Messages.AUTH.CHANGE_PASSWORD,true)
   } catch (error) {
    handleControllerError(res,error)
   }
  }
}
