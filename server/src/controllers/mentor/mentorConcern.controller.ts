import { Request, Response } from "express";
import { IMentorConcernController } from "../../core/interfaces/controllers/mentor/IMentorConcern.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { decodeToken } from "../../utils/JWTtoken";
import { IAttachment } from "../../types/concernTypes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import mongoose from "mongoose";
import { uploadConcernAttachment, getSignedS3Url } from "../../utils/s3Utilits";

@injectable()
export class MentorConcernController implements IMentorConcernController {
  constructor(
    @inject(TYPES.mentorConcernService)
    private _mentorConcernService: IMentorConcernService
  ) {}

   async addConcern(req: Request, res: Response): Promise<void> {
     try {
       const { message, courseId, title } = req.body;
       const decoded = decodeToken(req.cookies.token);
       const attachments: IAttachment[] = [];
       if (req.files && Array.isArray(req.files) && req.files.length > 0) {
         for (const file of req.files) {
           let s3Key: string;
           try {
             s3Key = await uploadConcernAttachment(file.buffer, file.mimetype);
           } catch (uploadError: any) { 
             throwError(`Failed to upload attachment ${file.originalname}: ${uploadError.message || 'Unknown error'}`, StatusCode.INTERNAL_SERVER_ERROR);
           }

           attachments.push({
             url: s3Key,
             filename: file.originalname,
             size: file.size,
             type: file.mimetype.startsWith("image") ? "image" : "audio",
           });
         }
       } 
      
       if (!decoded?.id) {
        throwError("Unauthorized", StatusCode.UNAUTHORIZED);
       }
       const concern = await this._mentorConcernService.addConcern({
         title,
         message,
         courseId,
         mentorId: decoded.id,
         attachments,
       });
       if (concern.attachments && concern.attachments.length > 0) {
         console.log("Generating signed URLs for response attachments...");
         for (const attachment of concern.attachments) {
           try {
             attachment.url = await getSignedS3Url(attachment.url);
           } catch (error) {
             attachment.url = ""; 
           }
         }
       } 
       sendResponse(res, StatusCode.OK, "Concern raised successfully", true, concern);
     } catch (error) {
       console.error("Error in addConcern Controller:", error);
       handleControllerError(res, error);
     }
  }

  async getConcern(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);

      if (!decoded?.id) {
        throwError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      const queryParams = (req.query.params || {}) as Record<string, string>;

      const {
        page = "1",
        pageSize = "10",
        search = "",
        status,
        courseId,
        sortBy = "createdAt",
        sortOrder = "desc"
      } = queryParams;

      const limit = parseInt(pageSize);
      const skip = (parseInt(page) - 1) * limit;
      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1
      };

      const filters: Record<string, any> = { mentorId: decoded.id };
      if (status) filters.status = status;
      if (courseId) filters.courseId = courseId;
      if (search) {
        filters.$or = [
          { title: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } }
        ];
      }

      const { data, total } = await this._mentorConcernService.getConcerns(filters, sort, skip, limit);

      for (const concern of data) {
        if (concern.attachments && Array.isArray(concern.attachments)) {
          for (const attachment of concern.attachments) {
            try {
              attachment.url = await getSignedS3Url(attachment.url);
            } catch (error) {
              attachment.url = "";
            }
          }
        }
      }

      sendResponse(res, StatusCode.OK, "Fetched concerns successfully", true, {
        data,
        total,
        page: parseInt(page),
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
