import { injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";
import { throwError } from "../../utils/ResANDError";  

@injectable()
class AdminAuthService implements IAdminAuthService {
  login(email: string, password: string): { accessToken: string, refreshToken: string } {
    if (
      process.env.ADMIN_USERNAME === email &&
      process.env.ADMIN_PASSWORD === password
    ) {
      const accessToken = generateAccessToken("admin11Sharafath", "admin");
      const refreshToken = generateRefreshToken("admin11Sharafath", "admin");

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throwError("Invalid credentials", 401);  
    }
  }
}

export default AdminAuthService;
