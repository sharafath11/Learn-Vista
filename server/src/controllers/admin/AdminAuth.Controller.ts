import { Request, Response } from "express";
import AdminAuthService from "../../services/admin/auth.service";
class AdminAuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ ok: false, msg: "Invalid email or password" });
        return
    }

    try {
      const result = await AdminAuthService.loginService(email, password,res);
      res.status(200).json(result)
    } catch (error: any) {
      console.error("Login error:", error.message);
      res.status(500).json({ ok: false, msg: error.message});
    }
  } 
 
}

export default new AdminAuthController();
