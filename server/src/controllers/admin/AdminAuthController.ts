import { Request, Response } from "express";
import AdminAuthService from "../../services/admin/auth.service"
class AdminAuthController{
    login(req:Request,res:Response) {
        try {
            if (!req.body.username || req.body.password) res.json({ ok: false, msg: "invalid password or username" });
            AdminAuthService.loginService(req.body.username,req.body.password,res)
        } catch (error) {
            
        }
    }
} 
export default new AdminAuthController