import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { TYPES } from "../../core/types";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { clearTokens, setTokensInCookies } from "../../utils/JWTtoken";
import { sendResponse, handleControllerError, throwError } from "../../utils/ResANDError"; // Add throwError import

@injectable()
class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private adminAuthServices: IAdminAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      throwError("Invalid email or password", 400); 
    }

    try {
      const { accessToken, refreshToken } =
        await this.adminAuthServices.login(email, password);

      setTokensInCookies(res, accessToken, refreshToken);

      sendResponse(res, 200, "Login successful", true);
      return
    } catch (error) {
      handleControllerError(res, error, 500);
    }
  }

  logout(req: Request, res: Response): void {
    try {
      clearTokens(res);
    } catch (error) {
      handleControllerError(res, error, 400);
    }
  }
}

export default AdminAuthController;
