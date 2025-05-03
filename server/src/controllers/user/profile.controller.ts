import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { validateMentorApplyInput } from "../../validation/userValidation";
import { IProfileController } from "../../core/interfaces/controllers/user/IProfileController";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { ISocialLink } from "../../types/mentorTypes";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { sendResponse, handleControllerError, throwError } from "../../utils/ResANDError";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.ProfileService) private profileService: IProfileService
  ) {}

  async applyMentor(req: Request, res: Response) {
    try {
      const { email, username, phoneNumber, expertise, socialLinks } = req.body;

      const { isValid, errorMessage } = validateMentorApplyInput(
        email, username, phoneNumber, req.file || null, expertise
      );
      if (!isValid) {
        return throwError(errorMessage as string, 400);
      }

      if (!req.file) {
        return throwError("No file uploaded", 400);
      }

      let parsedExpertise: string[] = [];
      if (typeof expertise === "string") {
        try {
          parsedExpertise = JSON.parse(expertise); 
        } catch (error) {
          return throwError("Invalid expertise format", 400);
        }
      } else {
        parsedExpertise = expertise; 
      }

      let parsedSocialLinks: ISocialLink[] = [];
      if (typeof socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(socialLinks); 
        } catch (error) {
          return throwError("Invalid socialLinks format", 400);
        }
      } else {
        parsedSocialLinks = socialLinks;
      }

      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded?.id || decoded.role !== "user") {
        return throwError("Please login", 401);
      }

      await this.profileService.applyMentor(
        email,
        username,
        req.file,
        parsedExpertise,
        decoded.id,
        phoneNumber,
        parsedSocialLinks
      );

      sendResponse(res, 201, "Application submitted successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async editProfile(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const image = req.file?.buffer;

      if (username.trim().length < 6) {
        return throwError("Username must be at least 6 characters long", 403);
      }

      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError("Invalid token", 401);
      }

      const result = await this.profileService.editProfileService(
        username, 
        image || undefined, 
        decoded.id
      );

      sendResponse(res, 200, "Profile updated successfully", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
