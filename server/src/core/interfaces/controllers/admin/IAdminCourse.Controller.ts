import { Request,Response } from "express";

export interface IAdminCourseController {
    createClass(req: Request, res: Response): void
    addCategories(req: Request, res: Response): void
    editCategories(req: Request, res: Response): Promise<void>
    editCourse(req:Request,res:Response):Promise<void>
    getAllCategories(req: Request, res: Response): Promise<void>
    getCategories(req:Request,res:Response):Promise<void>
    blockCategorie(req: Request, res: Response): Promise<void>
    getCourse(req: Request, res: Response): Promise<void>
    blockCourses(req: Request, res: Response): Promise<void>
    getConcernController(req:Request,res:Response):Promise<void>
    updateConcernStatus(req: Request, res: Response): Promise<void>
    getAllConcerns(req:Request,res:Response):Promise<void>
}