import { Request, Response } from "express";

export interface IMentorStreamController{
    startStreamController(req: Request, res: Response): Promise<void>
    endStreamController(req:Request,res:Response):Promise<void>
}