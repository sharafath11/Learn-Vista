import { Request, Response } from "express";

export interface IUserLessonsController {
    getLessons(req: Request, res: Response): Promise<void>
    getQuestions(req: Request, res: Response): Promise<void>
    getAllDetilsInLesson(req: Request, res: Response): Promise<void>
    getLessonReport(req: Request, res: Response): Promise<void>
    saveComments(req:Request,res:Response):Promise<void>
    updateLessonProgress(req: Request, res: Response): Promise<void>
    saveVoiceNote(req: Request, res: Response): Promise<void>;
    getVoiceNotes(req: Request, res: Response): Promise<void>;

} 