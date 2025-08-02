import { Request, Response } from "express";

export interface IAdminCategoryController {
  addCategories(req: Request, res: Response): void;
  editCategories(req: Request, res: Response): Promise<void>;
  getAllCategories(req: Request, res: Response): Promise<void>;
  getCategories(req: Request, res: Response): Promise<void>;
  blockCategorie(req: Request, res: Response): Promise<void>;
}