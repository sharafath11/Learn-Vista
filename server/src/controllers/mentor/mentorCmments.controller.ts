import { Request, Response } from "express";
import { IMentorCommentsController } from "../../core/interfaces/controllers/mentor/IMentorComments.controller";
import { handleControllerError, sendResponse, throwError } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IMentorCommentsService } from "../../core/interfaces/services/mentor/IMentorComments.Service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { decodeToken } from "../../utils/jwtToken";
import { Messages } from "../../constants/messages";

@injectable()
export class MentorCommentController implements IMentorCommentsController {
  constructor(
    @inject(TYPES.MentorCommentsService)
    private _commentService: IMentorCommentsService
  ) {}

  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const rawParams = req.query.params as any;

 

      const page = parseInt(rawParams?.page) || 1;
      const limit = parseInt(rawParams?.limit) || 10;
      const sortBy = rawParams?.sortBy === "oldest" ? "createdAt" : "createdAt"; 
      const sortOrder = rawParams?.sortBy === "oldest" ? "asc" : "desc";
      const search = rawParams?.search || "";
      const courseId = rawParams?.courseId || undefined;
      const decoded=decodeToken(req.cookies.token)
     if(!decoded) throwError(Messages.COMMON.UNAUTHORIZED,StatusCode.OK)
      const result = await this._commentService.getAllComments({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        courseId,
        mentorId:decoded.id
      });

     

      sendResponse(res, StatusCode.OK, Messages.COMMENT.FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
