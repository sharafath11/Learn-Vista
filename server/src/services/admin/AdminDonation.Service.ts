import { inject, injectable } from "inversify";
import { IAdminDonationServices } from "../../core/interfaces/services/admin/IAdminDonationService";
import { IDonation } from "../../types/donationTypes";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
@injectable()
export class AdminDonationService implements IAdminDonationServices{
    constructor(
        @inject(TYPES.DonationRepository) private _donationRepo:IDonationRepoitory
    ) { }
    async getConcerns(): Promise<IDonation[]> {
        return await this._donationRepo.findAll()
    }
    async getFilteredDonations(
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<IDonation[]> {
   return this._donationRepo.findManyWithFilter(filters, sort, skip, limit);
}

async countFilteredDonations(filters: Record<string, unknown>): Promise<number> {
  return this._donationRepo.countFiltered(filters);
}
}