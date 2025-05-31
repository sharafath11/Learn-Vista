import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { TYPES } from "../../core/types";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { sendResponse, handleControllerError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private adminAuthServices: IAdminAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Email and password are required", false);
      }

      const { accessToken, refreshToken } = await this.adminAuthServices.login(email, password);
      setTokensInCookies(res, accessToken, refreshToken);

      return sendResponse(res, StatusCode.OK, "Login successful", true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  logout(req: Request, res: Response): void {
    try {
      clearTokens(res);
        
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}

export default AdminAuthController;
