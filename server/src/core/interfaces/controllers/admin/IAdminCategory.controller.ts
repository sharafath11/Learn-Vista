import { Request, Response } from "express";

export interface IAdminCategoryController {
  addCategory(req: Request, res: Response): Promise<void>;
  editCategory(req: Request, res: Response): Promise<void>;
  blockCategory(req: Request, res: Response): Promise<void>;
  getAllCategories(req: Request, res: Response): Promise<void>;
  getCategories(req: Request, res: Response): Promise<void>;
}
