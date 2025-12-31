import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/types';
import { IKmatService } from '../../../core/interfaces/services/user/IKmatService';
import { IKmatController } from '../../../core/interfaces/controllers/user/IKmat.controller';
import { StatusCode } from '../../../enums/statusCode.enum';
import { verifyAccessToken } from '../../../utils/jwtToken';
import { handleControllerError, sendResponse, throwError } from '../../../utils/resAndError';
import { Messages } from '../../../constants/messages';

@injectable()
export class KmatController implements IKmatController {
  constructor(
    @inject(TYPES.KmatService) private kmatService: IKmatService
  ) {}

  async getDailyData(req: Request, res: Response) {
    try {
      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const data = await this.kmatService.getDailyData(decoded.id);
      sendResponse(res, StatusCode.OK, "", true, data);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  }

  async startExam(req: Request, res: Response) {
    try {
      const decoded = verifyAccessToken(req.cookies.token);
      const { dayNumber } = req.body;
      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const result = await this.kmatService.startExam(decoded.id, dayNumber);
      sendResponse(res, StatusCode.CREATED, "", true, result);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  }

  async submitExam(req: Request, res: Response) {
    try {
      const decoded = verifyAccessToken(req.cookies.token);
      const { dayNumber, sessionId, answers } = req.body;
      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const result = await this.kmatService.submitExam(decoded.id, dayNumber, sessionId, answers);
      sendResponse(res, StatusCode.OK, "", true, result);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  }

  async getResult(req: Request, res: Response) {
    try {
        const decoded = verifyAccessToken(req.cookies.token);
        const { id } = req.params; 
        if (!decoded?.id) {
            throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
        }
        const result = await this.kmatService.getResult(id);
        sendResponse(res, StatusCode.OK, "", true, result);
    } catch (error: any) {
        handleControllerError(res, error);
    }
  }

  async generateReport(req: Request, res: Response) {
      try {
          const decoded = verifyAccessToken(req.cookies.token);
          const { dayNumber } = req.body;
          if (!decoded?.id) {
              throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
          }
          const report = await this.kmatService.generateDailyReport(decoded.id, dayNumber);
          sendResponse(res, StatusCode.OK, "", true, report);
      } catch (error: any) {
          handleControllerError(res, error);
      }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const decoded = verifyAccessToken(req.cookies.token);
      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const history = await this.kmatService.getHistory(decoded.id);
      sendResponse(res, StatusCode.OK, "", true, history);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  }

  async submitPractice(req: Request, res: Response) {
    try {
      const decoded = verifyAccessToken(req.cookies.token);
      const { dayNumber, answers } = req.body;
      if (!decoded?.id) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const result = await this.kmatService.submitPractice(decoded.id, dayNumber, answers);
      sendResponse(res, StatusCode.OK, "", true, result);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  }
}
