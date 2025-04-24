import { Request, Response } from "express";
import { IMentorProfileController } from "../../core/interfaces/controllers/mentor/IMentorProfile.controller";
import { decodeToken } from "../../utils/JWTtoken";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorProfileService } from "../../core/interfaces/services/mentor/IMentorProfile.Service";
@injectable()
export class MentorProfileController implements IMentorProfileController{
    constructor(
        @inject(TYPES.MentorProfileService) private mentorProfileService: IMentorProfileService
    ) {
        console.log("MentorProfileService injected?", this.mentorProfileService !== undefined);
    }
    async editProfile(req: Request, res: Response): Promise<void> {
        try {
           const {username,bio}=req.body
           const decode = decodeToken(req.cookies.token);
            if (!decode ||decode.role!=="mentor") throwError("Unauthorized");
            const data = await this.mentorProfileService.editProfile(username, bio, req.file?.buffer, decode?.id as string);
            sendResponse(res,200,"Profile updated Succesfull",true,data)
       } catch (error:any) {
       sendResponse(res,500,error.message,false)
       }
    }
    
  
}
