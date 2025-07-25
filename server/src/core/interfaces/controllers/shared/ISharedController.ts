import { Request, Response } from "express";

export interface ISharedController {
    getSignedS3Url(req: Request, res: Response): Promise<void>;
}