import { Request ,Response} from "express";
import authService from "../services/user/authService";
import jwt from "jsonwebtoken"
import { decodeToken } from "../utils/tokenDecode";
class AuthController{
    async signup(req: Request, res: Response) {
        try {
            const newUser = await authService.registerUser(req.body);
            res.status(201).json({ok:true,msg:"User registretion successfull"})
        } catch (error:any) {
            res.status(400).json({ ok:false,msg: error.message });
        }
    }
    async otpSend(req: Request, res: Response) {
        try {
            await authService.sendOtp(req.body.email);
            res.status(200).json({ok:true,msg:`Otp send at ${req.body.email}`})
        } catch (error:any) {
            res.status(400).json({ok:false,msg:error.message})
        }
    }
    async otpVerifyController(req: Request, res: Response) {
        try {
            await authService.verifyOtp(req.body.email, req.body.otp);
            res.status(200).json({ok:true,msg:"Verify succes full"})
        } catch (error:any) {
            res.status(400).json({ok:false,msg:error.message})
        }
    }

    async login(req: Request, res: Response) {
        try {
            await authService.loginUser(req.body.email,req.body.password,res)
        }catch (error:any) {
            res.status(400).json({ok:false,msg:error.message})
        }
    }
    async getUser(req: Request, res: Response) {
        try {
          const userId = req.user?.id || req.cookies.accessToken;
          if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
          }
    
          const user = await authService.getUser(userId);
          return res.status(200).json(user);
        } catch (error: any) {
          return res.status(500).json({ message: error.message });
        }
      }
}
export default new AuthController()