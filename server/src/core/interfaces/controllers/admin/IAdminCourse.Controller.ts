import { Request,Response } from "express";

export interface IAdminCourseController {
    createClass(req: Request, res: Response): void
    addCategories(req: Request, res: Response): void
    getAllCategories(req: Request, res: Response): Promise<void>
    blockCategorie(req: Request, res: Response): Promise<void>
    getCourse(req: Request, res: Response): Promise<void>
    blockCourses(req:Request,res:Response):Promise<void>
}