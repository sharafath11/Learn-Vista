import { Request, Response } from 'express';

export interface IMentorStudentsController {
    getStudentDetilesController(req: Request, res: Response): Promise<void>
    blockStudentController(req:Request,res:Response):Promise<void>
}