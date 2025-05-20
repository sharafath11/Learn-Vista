import { Request, Response } from "express";

export interface IMentorProfileController{
    editProfile(req: Request, res: Response): void
    changePassword(req:Request,res:Response):void
}