import { Request, Response } from "express";
import { ISafeUser } from "../../../../types/userTypes";

export interface IUserController{
    getUser(req:Request,res:Response):Promise<void>
}