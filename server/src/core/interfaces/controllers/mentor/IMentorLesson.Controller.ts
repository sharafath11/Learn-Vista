import { Request, Response } from "express";

export interface IMentorLessonsController {
  getLessons(req: Request, res: Response): Promise<void>
  S3Upload(req:Request,res:Response):Promise<void>
  addLesson(req: Request, res: Response): Promise<void>;
  editLesson(req: Request, res: Response): Promise<void>;
  deleteS3File(req: Request, res: Response): Promise<void>;
  // uploadToS3(req: Request, res: Response): Promise<void>;V
  getSignedVideoUrl(req: Request, res: Response): Promise<void>
  getQuestions(req: Request, res: Response): Promise<void>
  addQuestions(req: Request, res: Response): Promise<void>
  editQuestions(req:Request,res:Response):Promise<void>
}