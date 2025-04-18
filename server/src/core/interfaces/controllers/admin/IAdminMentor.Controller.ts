import { Request, Response } from "express";
import { IMentor, SafeMentor } from "../../../../types/mentorTypes";


export interface IAdminMentorController{
    getAllMentors(req: Request, res: Response): void;
    changeStatus(req: Request, res: Response): void 
    mentorDetils(req:Request,res:Response):void
}