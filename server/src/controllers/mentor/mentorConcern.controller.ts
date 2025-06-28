import { Request, Response } from "express";
import { IMentorConcernController } from "../../core/interfaces/controllers/mentor/IMentorConcern.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { decodeToken } from "../../utils/JWTtoken";
import { IAttachment } from "../../types/concernTypes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { uploadToCloudinary } from "../../utils/cloudImage";
import mongoose from "mongoose";

@injectable()
export class MentorConcernController implements IMentorConcernController {
  constructor(
    @inject(TYPES.mentorConcernService)
    private _mentorConcernService: IMentorConcernService
  ) {}

  async addConcern(req: Request, res: Response): Promise<void> {
    try {
      const { message, courseId } = req.body;
      const decoded = decodeToken(req.cookies.token);

      const attachments: IAttachment[] = [];
       
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const url = await uploadToCloudinary(file.buffer, "mentor_concerns");
          attachments.push({
            url,
            filename: file.originalname,
            size: file.size,
            type: file.mimetype.startsWith("image") ? "image" : "audio",
          });
        }
      }
        console.log(courseId)
      if(!decoded?.id) throwError("Unauthrized",StatusCode.UNAUTHORIZED)
      const concern = await this._mentorConcernService.addConcern({
        message,
        courseId,
        mentorId:decoded.id,
        attachments,
      });

      sendResponse(res,StatusCode.OK,"Concern rised cucesfull",true,concern)
    } catch (error) {
      handleControllerError(res,error)
    }
  }
}
