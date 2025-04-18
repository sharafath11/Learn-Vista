import { Request, Response } from "express";
import { SafeMentor } from "../../../../types/mentorTypes";


export interface IAdminMentorController{
    getAllMentors(req: Request, res: Response): void;
    changeStatus(req:Request,res:Response):void 
}