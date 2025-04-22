import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { validateMentorApplyInput } from "../../utils/userValidation";
import { IProfileController } from "../../core/interfaces/controllers/user/IProfileController";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { ISocialLink } from "../../types/mentorTypes";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";
import { sendResponse } from "../../utils/ResANDError";

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
        return sendResponse(res, 400, errorMessage as string, false);
      }
  
      if (!req.file) {
        return sendResponse(res, 400, "No file uploaded", false);
      }

      let parsedExpertise: string[] = [];
      if (typeof expertise === "string") {
        try {
          parsedExpertise = JSON.parse(expertise); 
        } catch (error) {
          return sendResponse(res, 400, "Invalid expertise format", false);
        }
      } else {
        parsedExpertise = expertise; 
      }

      let parsedSocialLinks: ISocialLink[] = [];
      if (typeof socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(socialLinks); 
        } catch (error) {
          return sendResponse(res, 400, "Invalid socialLinks format", false);
        }
      } else {
        parsedSocialLinks = socialLinks;
      }
  
      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded?.id || decoded.role !== "user") {
        return sendResponse(res, 401, "Please login", false, { role: "user" });
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
    } catch (error: any) {
      console.error(error);
      sendResponse(res, 500, error.message || "Server error", false);
    }
  }

  async editProfile(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const image = req.file?.buffer;
  
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return sendResponse(res, 401, "Invalid token", false);
      }
  
      const result = await this.profileService.editProfileService(
        username, 
        image || undefined, 
        decoded.id
      );
  
      sendResponse(res, 200, "Profile updated successfully", true, result);
    } catch (error: any) {
      console.error("Edit profile error:", error);
      sendResponse(res, 500, error.message || "Server error", false);
    }
  }
}