import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";

import { validateMentorApplyInput } from "../../utils/userValidation";
import { IProfileController } from "../../core/interfaces/controllers/user/IProfileController";
import { IProfileService } from "../../core/interfaces/services/user/IUserProfileService";
import { ISocialLink } from "../../types/mentorTypes";
import { decodeToken, verifyAccessToken } from "../../utils/JWTtoken";

@injectable()
export class ProfileController implements IProfileController{
  constructor(
    @inject(TYPES.ProfileService) private profileService: IProfileService
  ) {}

  async applyMentor(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { email, username, phoneNumber, expertise, socialLinks } = req.body;

      const { isValid, errorMessage } = validateMentorApplyInput(
        email, username, phoneNumber, req.file || null, expertise
      );
      if (!isValid) throw new Error(errorMessage);
  
      if (!req.file) {
        res.status(400).json({ ok: false, msg: "No file uploaded" });
        return;
      }
      let parsedExpertise: string[] = [];
      if (typeof expertise === "string") {
        try {
          parsedExpertise = JSON.parse(expertise); 
        } catch (error) {
          throw new Error("Invalid expertise format");
        }
      } else {
        parsedExpertise = expertise; 
      }
      let parsedSocialLinks: ISocialLink[] = [];
      if (typeof socialLinks === "string") {
        try {
          //cionvwert inbto array
          parsedSocialLinks = JSON.parse(socialLinks); 
        } catch (error) {
          throw new Error("Invalid socialLinks format");
        }
      } else {
        parsedSocialLinks = socialLinks;
      }
  
      console.log("Parsed socialLinks:", parsedSocialLinks);
  
    
      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded||!decoded.id||decoded.role!=="user") {
        res.status(401).json({ ok: false, msg: "Please login",role:"user" });
        return;
      }
  
      // const id = typeof decoded === "object" && "userId" in decoded ? decoded.id : decoded; 
      const mentor = await this.profileService.applyMentor(
        email,
        username,
        req.file,
        parsedExpertise,
        decoded.id,
        phoneNumber,
        parsedSocialLinks
      );
  
      res.status(201).json({ ok: true, msg: "Application submitted successfully", mentor });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ ok: false, msg: error.message || "Server error" });
    }
  }
   async  editProfile(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const image = req.file?.buffer;
      
      // if (!username || !image) {
      //   res.status(400).json({ ok:false,msg: "Username and image are required." });
      //   return
      // }
  
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        res.status(401).json({ok:false, msg: "Invalid token." });
        return
      }
  
      const result = await this.profileService.editProfileService(username, image || undefined, decoded.id);
  
       res.status(200).json({
         ok: true,
         msg:"Profile updated Succesfull",
        data: result,
       });
       return
    } catch (error) {
      console.error("Edit profile error:", error);
      res.status(500).json({ ok:false,msg: "Internal server error." });
      return
    }
  }
}
