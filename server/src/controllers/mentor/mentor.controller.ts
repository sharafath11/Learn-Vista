import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { decodeToken } from '../../utils/jwtToken';
import { handleControllerError, sendResponse, throwError } from '../../utils/resAndError';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.controller';
import { StatusCode } from '../../enums/statusCode.enum';
import { Messages } from '../../constants/messages'; 

@injectable()
export class MentorController implements IMentorController {
  constructor(
    @inject(TYPES.MentorService) private _mentorService: IMentorService
  ) {}

  async getMentor(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token);
      if (!decoded?.id) {
        return throwError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      const mentor = await this._mentorService.getMentor(decoded.id);
      if (!mentor) {
        throwError(Messages.MENTOR.NOT_FOUND, StatusCode.NOT_FOUND);
      }

      return sendResponse(res, StatusCode.OK, Messages.MENTOR.FETCHED, true, mentor); 
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
