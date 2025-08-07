import { Request, Response } from "express";
// import { ISafeUser } from "../../../../types/userTypes";

export interface IUserController{
    getUser(req: Request, res: Response): Promise<void>,
    forgotPasword(req: Request, res: Response): Promise<void>,
    resetPassword(req: Request, res: Response): void
    getDailyTask(req:Request,res:Response):void
    getQuestionByNumber(req: Request, res: Response): void
    updateDailyTask(req: Request, res: Response): Promise<void>,
    getAllDailyTask(req: Request, res: Response): Promise<void>
}