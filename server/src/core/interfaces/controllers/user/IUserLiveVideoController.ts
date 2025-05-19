import { Request, Response } from "express";

export interface IUserLiveController{
    getRoomId(req:Request,res:Response):Promise<void>
}