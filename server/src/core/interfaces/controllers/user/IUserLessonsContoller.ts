import { Request, Response } from "express";

export interface IUserLessonsController {
    getLessons(req: Request, res: Response): Promise<void>
    getQuestions(req: Request, res: Response): Promise<void>
    getAllDetilsInLesson(req:Request,res:Response):Promise<void>
} 