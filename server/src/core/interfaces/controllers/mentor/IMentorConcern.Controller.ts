import { Request, Response } from "express";

export interface IMentorConcernController{
    addConcern(req: Request, res: Response):Promise<void>;
}