import { Request, Response } from 'express';

export interface IMentorController {
  getMentor(req: Request, res: Response): Promise<void>;
}