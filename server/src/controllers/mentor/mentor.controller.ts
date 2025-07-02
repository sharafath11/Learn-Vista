import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { decodeToken } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse, throwError } from '../../utils/ResANDError';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.Controller';
import { StatusCode } from '../../enums/statusCode.enum';

@injectable()
export class MentorController implements IMentorController {
  constructor(
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  async getMentor(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      const mentor = await this.mentorService.getMentor(decoded.id);
      if (!mentor) {
        throwError("Mentor not found", StatusCode.NOT_FOUND);
      }

      return sendResponse(res, StatusCode.OK, "Mentor fetched successfully", true, mentor);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError("Unauthorized", StatusCode.UNAUTHORIZED);
      }
      
      const result = await this.mentorService.getCourses(decoded.id);
      sendResponse(res, StatusCode.OK, "Courses fetched successfully", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async statusChange(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      const { courseId, status, courseRejectReson } = req.body;

      if (!decoded?.id) {
        return throwError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      await this.mentorService.courseApproveOrReject(decoded.id, courseId, status, courseRejectReson);
      return sendResponse(res, StatusCode.OK, "Status changed successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
 async coursePagenated(req: Request, res: Response): Promise<void> {
  try {
    console.log("🔍 Incoming request for mentor paginated courses");

    const decoded = decodeToken(req.cookies.token);
    console.log("🪪 Decoded Token:", decoded);

    const query = (req.query as any).params || {};
    console.log("📥 Full query:", query);

    if (!decoded?.id) {
      return throwError("Unauthorized", StatusCode.UNAUTHORIZED);
    }

    const mentorId = decoded.id;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const search = query.search;
    let sort: Record<string, 1 | -1> | undefined = undefined;
    if (query.sort) {
      const rawSort = query.sort;
      sort = {};
      for (const key in rawSort) {
        const value = rawSort[key];
        sort[key] = value === '1' || value === 1 ? 1 : -1;
      }
    }

    const filters = query.filters;

    console.log(" Final Query Params:", {
      page,
      limit,
      search,
      filters,
      sort,
    });

    const { data, total ,categories} = await this.mentorService.courseWithPagenated({
      mentorId,
      page,
      limit,
      search,
      filters,
      sort,
    });

    return sendResponse(res, StatusCode.OK, "Courses fetched successfully", true, {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      categories
    });

  } catch (error) {
    handleControllerError(res, error);
  }
}




}
