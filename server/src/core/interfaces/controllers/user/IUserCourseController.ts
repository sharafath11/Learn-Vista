import { Request, Response } from "express";


export interface IUserCourseController{
    getAllCourse(req: Request, res: Response): Promise<void>
    updateUserCourse(req: Request, res: Response): Promise<void>
    getCategories(req: Request, res: Response): Promise<void>
    getProgressDetiles(req: Request, res: Response): Promise<void>
    updateLessonProgress(req: Request, res: Response): Promise<void>;
}