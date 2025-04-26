import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { decodeToken } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse, throwError } from '../../utils/ResANDError';

@injectable()
export class MentorController {
  constructor(
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  async getMentor(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);

      if (!decoded?.id) {
        return throwError( "Unauthorized", 401);
      }

      const mentor = await this.mentorService.getMentor(decoded.id);
      if (!mentor) {
        throwError("Mentor not found", 404);
      }

      return sendResponse(res, 200, "Mentor fetched successfully", true, mentor);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
