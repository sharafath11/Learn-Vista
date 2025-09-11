import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.controller';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import {
  clearTokens,
  decodeToken,
  setTokensInCookies,
} from '../../utils/jwtToken';
import {
  handleControllerError,
  sendResponse,
} from '../../utils/resAndError';
import { StatusCode } from '../../enums/statusCode.enum';
import { Messages } from '../../constants/messages';

@injectable()
export class MentorAuthController implements IMentorAuthController {
  constructor(
    @inject(TYPES.MentorAuthService) private _authService: IMentorAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendResponse(
          res,
          StatusCode.BAD_REQUEST,
          Messages.AUTH.MISSING_CREDENTIALS,
          false
        );
      }

      const result = await this._authService.loginMentor(email, password);
      setTokensInCookies(res, result.token, result.refreshToken);
      return sendResponse(res, StatusCode.OK, Messages.AUTH.LOGIN_SUCCESS, true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async signupController(req: Request, res: Response): Promise<void> {
    try {
      await this._authService.mentorSignup(req.body);
      return sendResponse(res, StatusCode.CREATED, Messages.MENTOR.CREATED, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      await this._authService.verifyOtp(req.body.email, req.body.otp);
      return sendResponse(res, StatusCode.OK, Messages.AUTH.VERIFICATION_SUCCESS, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async mentorOtpControler(req: Request, res: Response): Promise<void> {
    try {
      await this._authService.sendOtp(req.body.email);
      return sendResponse(res, StatusCode.OK, Messages.AUTH.OTP_SENT, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      clearTokens(res);
      
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COMMON.MISSING_FIELDS, false);
      }

      await this._authService.forgetPassword(email);
      return sendResponse(res, StatusCode.OK, Messages.AUTH.FORGOT_PASSWORD_SUCCESS, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async restartPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!password || !strongPasswordRegex.test(password)) {
        return sendResponse(
          res,
          StatusCode.FORBIDDEN,
          Messages.AUTH.WEAK_PASSWORD,
          false
        );
      }

      if (!token || !password) {
        return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COMMON.MISSING_FIELDS, false);
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.id || decoded.role !== 'mentor') {
        return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.AUTH.INVALID_TOKEN, false);
      }

      await this._authService.resetPassword(decoded.id, password);
      return sendResponse(res, StatusCode.OK, Messages.AUTH.PASSWORD_RESET_SUCCESS, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
