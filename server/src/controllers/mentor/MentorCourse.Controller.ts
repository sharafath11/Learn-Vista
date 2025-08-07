import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { decodeToken } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse, throwError } from '../../utils/ResANDError';
import { StatusCode } from '../../enums/statusCode.enum';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { IMentorCourseService } from '../../core/interfaces/services/mentor/IMentorCourse.Service';
import { IMentorCourseController } from '../../core/interfaces/controllers/mentor/IMentorCourse.controller';
import { Messages } from '../../constants/messages';

@injectable()
export class MentorCourseController implements IMentorCourseController{
  constructor(
    @inject(TYPES.MentorCourseService) private _mentorCourseService: IMentorCourseService
  ) {}

  async getCourses(req: Request, res: Response): Promise<void> {
      try {
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      const result = await this._mentorCourseService.getCourses(decoded.id);
      sendResponse(res, StatusCode.OK, Messages.COURSE.FETCHED, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      const courseId=req.params.courseId
      const { status, courseRejectReson } = req.body;

      if (!decoded?.id) {
        return throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      await this._mentorCourseService.courseApproveOrReject(decoded.id, courseId, status, courseRejectReson);
      sendResponse(res, StatusCode.OK, Messages.COURSE.STATUS_UPDATED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getPaginatedCourses(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      const query = (req.query as any).params || {};

      if (!decoded?.id) {
        return throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      const mentorId = decoded.id;
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 12;
      const search = query.search;

      let sort: Record<string, 1 | -1> | undefined;
      if (query.sort) {
        sort = {};
        for (const key in query.sort) {
          sort[key] = query.sort[key] === '1' || query.sort[key] === 1 ? 1 : -1;
        }
      }

      const filters = query.filters;

      const { data, total, categories } = await this._mentorCourseService.courseWithPagenated({
        mentorId,
        page,
        limit,
        search,
        filters,
        sort,
      });

      sendResponse(res, StatusCode.OK, Messages.COURSE.FETCHED, true, {
        data,
        total,
        totalPages: Math.ceil(total / limit),
        categories
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
    async publishCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.params.courseId;
            const {status}=req.body
            await this._mentorCourseService.publishCourse(courseId,status)
            sendResponse(res,StatusCode.OK,Messages.COURSE.PUBLISHED,true)
        } catch (error) {
          handleControllerError(res,error)  
        }
    }
}
