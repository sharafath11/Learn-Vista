import { Request, Response } from "express";

export interface IMentorCourseController {
  getCourses(req: Request, res: Response): Promise<void>;
  changeStatus(req: Request, res: Response): Promise<void>;
    getPaginatedCourses(req: Request, res: Response): Promise<void>;
    publishCourse(req:Request,res:Response):Promise<void>
}
