import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { clearTokens, decodeToken, setTokensInCookies } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse, throwError } from '../../utils/ResANDError';
import { StatusCode } from '../../enums/statusCode.enum';

@injectable()
export class MentorAuthController implements IMentorAuthController {
  constructor(
    @inject(TYPES.MentorAuthService) private authService: IMentorAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Email and password are required", false);
      }

      const result = await this.authService.loginMentor(email, password);
      setTokensInCookies(res, result.token, result.refreshToken);
      return sendResponse(res, StatusCode.OK, "Login successful", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async signupController(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.mentorSignup(req.body);
      return sendResponse(res, StatusCode.CREATED, "Mentor created successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.verifyOtp(req.body.email, req.body.otp);
      return sendResponse(res, StatusCode.OK, "Verification successful", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async mentorOtpControler(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.sendOtp(req.body.email);
      return sendResponse(res, StatusCode.OK, "OTP sent successfully", true);
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
        return sendResponse(res, StatusCode.BAD_REQUEST, "Email is required", false);
      }

      await this.authService.forgetPassword(email);
      return sendResponse(res, StatusCode.OK, "Password reset email sent if account exists", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async restartPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!password || !strongPasswordRegex.test(password)) {
        return sendResponse(
          res,
          StatusCode.FORBIDDEN,
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
          false
        );
      }

      if (!token || !password) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Token and password are required", false);
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.id || decoded.role !== "mentor") {
        return sendResponse(res, StatusCode.UNAUTHORIZED, "Invalid or expired token", false);
      }

      await this.authService.resetPassword(decoded.id, password);
      return sendResponse(res, StatusCode.OK, "Password reset successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
