import { Response } from "express";
import jwt from "jsonwebtoken";

class AdminAuthService {
  loginService(email: string, password: string, res: Response) {
    
    if (process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD === password) {
      const accessToken = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { role: "admin" },
        process.env.REFRESH_SECRET as string,
        { expiresIn: "7d" }
      );

      res.cookie("adminToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
     
      return({ ok: true, msg: "Login successful" });
    } else {
    
      throw new Error("Invalid credentials");
    }
  }
}

export default new AdminAuthService();
