import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";

@injectable()
class AdminAuthService implements IAdminAuthService {
  login(email: string, password: string):{accessToken:string,refreshToken:string} {
    if (
      process.env.ADMIN_USERNAME === email &&
      process.env.ADMIN_PASSWORD === password
    ) {
      const accessToken = jwt.sign(
        { id: "admin@123", role: "admin" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      
      const refreshToken = jwt.sign(
        { id: "admin@123", role: "admin" },
        process.env.REFRESH_SECRET as string,
        { expiresIn: "7d" }
      );
      

     
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
