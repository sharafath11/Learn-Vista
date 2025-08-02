import { Request,Response } from "express";

export interface IAdminCourseController {
  createClass(req: Request, res: Response): void;
  editCourse(req: Request, res: Response): Promise<void>;
  getCourse(req: Request, res: Response): Promise<void>;
  blockCourses(req: Request, res: Response): Promise<void>;
  getLessons(req: Request, res: Response): Promise<void>;
}