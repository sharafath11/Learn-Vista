import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminDonationController } from "../../core/interfaces/controllers/admin/IAdminDonation.Controller";
import { IAdminDonationServices } from "../../core/interfaces/services/admin/IAdminDonationService";
import { TYPES } from "../../core/types";
import { sendResponse, handleControllerError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Messages } from "../../constants/messages";

@injectable()
export class AdminDonationController implements IAdminDonationController {
  constructor(
    @inject(TYPES.AdminDonationService)
    private _adminDonationService: IAdminDonationServices
  ) {}

  async getDonations(req: Request, res: Response): Promise<void> {
    try {
      const donations = await this._adminDonationService.getDonation(); 
      sendResponse(res, StatusCode.OK, Messages.DONATION.FETCHED, true, donations);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getFilteredDonations(req: Request, res: Response): Promise<void> {
    try {
      const {
        fromDate,
        toDate,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 10,
      } = req.query as Record<string, string>;

      const filters: any = {};
      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      if (fromDate || toDate) {
        filters.createdAt = {};
        if (fromDate) filters.createdAt.$gte = new Date(fromDate);
        if (toDate) filters.createdAt.$lte = new Date(toDate);
      }

      if (status && status !== "all") {
        filters.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [donations, totalCount] = await Promise.all([
        this._adminDonationService.getFilteredDonations(
          filters,
          sort,
          skip,
          Number(limit)
        ),
        this._adminDonationService.countFilteredDonations(filters),
      ]);

      sendResponse(res, StatusCode.OK, Messages.DONATION.FILTERED_FETCHED, true, {
        transactions: donations,
        totalCount,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
