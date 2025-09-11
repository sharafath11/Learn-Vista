import { Request, Response } from "express";


export interface IProfileController{
    applyMentor(req: Request, res: Response): Promise<void>
    editProfile(req: Request, res: Response): Promise<void>
    changePassword(req:Request,res:Response):Promise<void>
}