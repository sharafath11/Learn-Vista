import { Request, Response } from "express";
import { IMentorConcernController } from "../../core/interfaces/controllers/mentor/IMentorConcern.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { decodeToken } from "../../utils/jwtToken";
import { handleControllerError, sendResponse, throwError } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";


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

    if (!decoded?.id) {
      throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
    }

    const files = req.files && Array.isArray(req.files) ? req.files : [];
    const concern = await this._mentorConcernService.addConcern({
      title,
      message,
      courseId,
      mentorId: decoded.id,
     
    }, files, );

    sendResponse(res, StatusCode.OK, Messages.CONCERN.RAISED, true, concern);
  } catch (error) {
    handleControllerError(res, error);
  }
}


  async getConcern(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);

      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
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

sendResponse(res, StatusCode.OK, Messages.CONCERN.FETCHED, true, {
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
