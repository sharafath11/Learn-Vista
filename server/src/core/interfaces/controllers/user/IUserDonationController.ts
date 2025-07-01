import { Request, Response } from "express";
// import { ISafeUser } from "../../../../types/userTypes";

export interface IUserDonationController{
   createCheckoutSession(req: Request, res: Response): Promise<void>
   // handleWebhook(req: Request, res: Response): Promise<void>;
   verifySession(req:Request,res:Response):Promise<void>
}