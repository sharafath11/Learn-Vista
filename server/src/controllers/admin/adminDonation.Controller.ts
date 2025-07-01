import { Request, Response } from "express";
import { IAdminDonationController } from "../../core/interfaces/controllers/admin/IAdminDonation.Controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminDonationServices } from "../../core/interfaces/services/admin/IAdminDonationService";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class AdminDonationController implements IAdminDonationController{
    constructor(
        @inject(TYPES.AdminDonationService) private _adminDonationService:IAdminDonationServices
    ) { }
    async getDonations(req: Request, res: Response): Promise<void> {
        try {
            const donations = await this._adminDonationService.getConcerns();
            sendResponse(res,StatusCode.OK,"donations fetched",true,donations)
        } catch (error) {
           handleControllerError(res,error) 
        }
    }
}