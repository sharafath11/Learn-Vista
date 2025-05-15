import { Request, Response } from "express";

export interface IMentorCourseController{
    startLiveController(req: Request, res: Response): Promise<void>
}