import { Response } from "express";

class AdminAuthService{
    loginService(email:string, password:string,res:Response) {
        if (process.env.ADMIN_USERNAME === email && process.env.ADMIN_PASSWORD==password)res.status(200).json({ok:true,msg:"Login succesfull"})
         else throw new Error("invalid credentiols")
    }
}
export default new AdminAuthService