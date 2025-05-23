import { Request, Response } from "express";

export interface IMentorLessonsController {
  getLessons(req:Request,res:Response):Promise<void>
}