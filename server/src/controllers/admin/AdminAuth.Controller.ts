import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { TYPES } from "../../core/types";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { sendResponse, handleControllerError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private adminAuthServices: IAdminAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this.adminAuthServices.login(
        email,
        password
      );

      setTokensInCookies(res, accessToken, refreshToken);
      sendResponse(res, StatusCode.OK, Messages.AUTH.LOGIN_SUCCESS, true);
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
