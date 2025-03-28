import { Request ,Response} from "express";
import authService from "../services/authService";

class AuthController{
    async signup(req: Request, res: Response) {
        try {
            const newUser = await authService.registerUser(req.body);
            res.status(201).json({ok:true,msg:"User registretion successfull"})
        } catch (error:any) {
            res.status(400).json({ ok:false,msg: error.message });
        }
    }
    async login(req: Request, res: Response) {
        try {
            const loginUser=await authService.loginUser(req.body.email,req.body.password)
        } catch (error) {
            res.status(400).json({ok:false,msg:"somthing fishy"})
        }
    }
}
export default new AuthController()