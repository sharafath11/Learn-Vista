import { Request, Response } from "express";

export interface IMentorCommentsController {
  getAllComments(req: Request, res: Response): Promise<void>;
}
