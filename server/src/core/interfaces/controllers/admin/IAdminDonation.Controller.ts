import { Request,Response } from "express";

export interface IAdminDonationController{
    getDonations(req:Request,res:Response):Promise<void>
}