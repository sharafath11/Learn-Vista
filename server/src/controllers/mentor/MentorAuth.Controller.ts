import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/types';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import { IMentorAuthService } from '../../core/interfaces/services/mentor/IMentorAuth.Service';
import { clearTokens, decodeToken, setTokensInCookies } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse, throwError } from '../../utils/ResANDError';

@injectable()
export class MentorAuthController implements IMentorAuthController {
  constructor(
    @inject(TYPES.MentorAuthService) private authService: IMentorAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.email || !req.body.password) {
        return sendResponse(res, 400, "Email and password are required", false);
      }

      const result = await this.authService.loginMentor(req.body.email, req.body.password);
      setTokensInCookies(res, result.token, result.refreshToken);
      sendResponse(res, 200, "Login successful", true, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async signupController(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.mentorSignup(req.body);
      sendResponse(res, 201, "Mentor created successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.verifyOtp(req.body.email, req.body.otp);
      sendResponse(res, 200, "Verification successful", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async mentorOtpControler(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.sendOtp(req.body.email);
      sendResponse(res, 200, "OTP sent successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      clearTokens(res);
      // sendResponse(res, 200, "Logout successful", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        return sendResponse(res, 400, "Email is required", false);
      }

      await this.authService.forgetPassword(email);
      sendResponse(res, 200, "Password reset email sent if account exists", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async restartPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!password || !strongPasswordRegex.test(password)) sendResponse(res,403,"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",false)
      if (!token || !password) {
        return sendResponse(res, 400, "Token and password are required", false);
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.id || decoded.role !== "mentor") {
        return sendResponse(res, 401, "Invalid or expired token", false);
      }

      await this.authService.resetPassword(decoded.id, password);
      sendResponse(res, 200, "Password reset successfully", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
