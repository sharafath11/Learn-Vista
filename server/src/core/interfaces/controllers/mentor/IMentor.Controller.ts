import { Request, Response } from 'express';

export interface IMentorController {
  getMentor(req: Request, res: Response): Promise<void>;
  getCourses(req: Request, res: Response): Promise<void>;
  statusChange(req: Request, res: Response): Promise<void>
  coursePagenated(req:Request,res:Response):Promise<void>
}