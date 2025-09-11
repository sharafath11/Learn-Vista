import { injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtToken";
import { throwError } from "../../utils/resAndError";  
import { StatusCode } from "../../enums/statusCode.enum"; 
import { Messages } from "../../constants/messages";

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
      throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED); 
    }
  }
}

export default AdminAuthService;
