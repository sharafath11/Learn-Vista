import { inject, injectable } from "inversify";
import { IAdminDonationServices } from "../../core/interfaces/services/admin/IAdminDonationService";
import { IDonation } from "../../types/donationTypes";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { throwError } from "../../utils/ResANDError";
import { Messages } from "../../constants/messages";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class AdminDonationService implements IAdminDonationServices{
    constructor(
        @inject(TYPES.DonationRepository) private _donationRepo:IDonationRepoitory
    ) { }
  async getDonation(): Promise<IDonation[]> {
    const result = await this._donationRepo.findAll();
    if (!result) {
        throwError(Messages.DONATION.FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    return result;
  }
    async getFilteredDonations(
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<IDonation[]> {
       const result = await this._donationRepo.findManyWithFilter(filters, sort, skip, limit);
    if (!result) {
        throwError(Messages.DONATION.FILTERED_FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    return result;
}

  async countFilteredDonations(filters: Record<string, unknown>): Promise<number> {
    const count = await this._donationRepo.countFiltered(filters);
    if (count === undefined) {
      throwError(Messages.DONATION.COUNT_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    return count
  }
}