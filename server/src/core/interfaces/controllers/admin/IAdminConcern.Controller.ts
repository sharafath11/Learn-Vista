import { Request, Response } from "express";

export interface IAdminConcernController {
  getConcernController(req: Request, res: Response): Promise<void>;
  updateConcernStatus(req: Request, res: Response): Promise<void>;
  getAllConcerns(req: Request, res: Response): Promise<void>;
}
