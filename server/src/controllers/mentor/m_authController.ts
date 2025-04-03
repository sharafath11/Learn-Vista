import { Request, Response } from "express";
import MentorRepo from "../../repositories/mentor/MentorRepo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authServices from "../../services/mentor/m_auth.service";

dotenv.config();

class m_Auth {
    async login(req: Request, res: Response) {
        try {
            await authServices.LoginMentor(req.body.email, req.body.password, res);
            
        } catch (error:any) {
            res.status(401).json({ok:false,msg:error.message})
        }
    }
}

export default new m_Auth();
