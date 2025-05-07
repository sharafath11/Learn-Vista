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
}
