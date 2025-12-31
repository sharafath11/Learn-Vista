import { Request, Response } from 'express';

export interface IKmatController {
  getDailyData(req: Request, res: Response): Promise<void>;
  startExam(req: Request, res: Response): Promise<void>;
  submitExam(req: Request, res: Response): Promise<void>;
  getResult(req: Request, res: Response): Promise<void>;
  generateReport(req: Request, res: Response): Promise<void>;
  getHistory(req: Request, res: Response): Promise<void>;
  submitPractice(req: Request, res: Response): Promise<void>;
}
