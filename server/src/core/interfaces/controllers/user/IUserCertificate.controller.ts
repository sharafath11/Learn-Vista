import { Request, Response } from "express";


export interface IUserCertificateController{
    getCertificates(req: Request, res: Response): Promise<void>
    getCertificate(req: Request, res: Response): Promise<void>
}