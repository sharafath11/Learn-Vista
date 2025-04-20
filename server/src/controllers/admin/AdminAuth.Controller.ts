import { Request, Response } from "express";
import AdminAuthService from "../../services/admin/auth.service";
import { inject, injectable } from "inversify";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { TYPES } from "../../core/types";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
@injectable()
class AdminAuthController implements IAdminAuthController{
  constructor(
    @inject (TYPES.AdminAuthService) private adminAuthServices :IAdminAuthService
  ){}
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ ok: false, msg: "Invalid email or password" });
      return;
    }
  
    try {
      const { accessToken, refreshToken } = this.adminAuthServices.login(email, password);
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({ ok: true, msg: "Login successful" });
    } catch (error: any) {
      console.error("Login error:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
  
  logout(req: Request, res: Response):void {
    try {
      res.clearCookie("adminToken");
      res.clearCookie("adminRefreshToken");
      res.status(200).json({ ok: true, msg: "Logged out successfully" });
     } catch (error :any) {
         res.status(400).json({ ok: false, msg: "somthing wrongggg :)" });
     }
  }
 
}

export default  AdminAuthController ;
