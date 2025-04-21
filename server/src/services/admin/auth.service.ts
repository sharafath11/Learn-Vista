import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";

@injectable()
class AdminAuthService implements IAdminAuthService {
  login(email: string, password: string):{accessToken:string,refreshToken:string} {
    if (
      process.env.ADMIN_USERNAME === email &&
      process.env.ADMIN_PASSWORD === password
    ) {
      const accessToken = generateAccessToken("admin11Sharafath", "admin");
      const refreshToken=generateRefreshToken("admin11Sharafath","admin")
      

     
      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }
  
}

export default AdminAuthService;
