import { Request, Response } from "express";
export interface IAdminUserController {
  getAllUsers(req: Request, res: Response): void;
  userBlock(req: Request, res: Response): Promise<void>;
  getCertificate(req: Request, res: Response): Promise<void>;
  revokCertificate(req: Request, res: Response): Promise<void>;

}
