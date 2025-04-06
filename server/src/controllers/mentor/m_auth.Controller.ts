import { Request, Response } from "express";
import dotenv from "dotenv";
import authServices from "../../services/mentor/MentorAuth.Service";


dotenv.config();

class m_Auth {
    async login(req: Request, res: Response) {
        try {
            console.log(req.body)
            const result=await authServices.loginMentor(req.body.email, req.body.password, res);
            res.status(200).json({ok:true,msg:"Login succesfullly",payload:result})
        } catch (error:any) {
            res.status(401).json({ok:false,msg:error.message})
        }
    }
    async signupController(req: Request, res: Response) {
        try {   
            await authServices.mentorSignup(req.body);
            res.status(201).json({ ok: true, msg: "Mentor created successfully" });
        } catch (error:any) {
            console.error("Signup error:", error);
            res.status(400).json({ ok: false, msg: error.message });
        }
    }
      async verifyOtp(req: Request, res: Response) {
            try {
                await authServices.verifyOtp(req.body.email, req.body.otp);
                res.status(200).json({ ok: true, msg: "Verification successful" });
            } catch (error: any) {
                res.status(400).json({ ok: false, msg: error.message});
            }
        }
    async mentorOtpControler(req:Request,res:Response) {
        try {
          
            await authServices.sendOtp(req.body.email);
            
            res.status(200).json({ ok: true, msg: "Otp send successfully" });
        } catch (error:any) {
            console.error("Signup error:", error);
            res.status(400).json({ ok: false, msg: error.message });
        }
    }
    
    
}

export default new m_Auth();
