import { inject, injectable } from "inversify";
import { IAdminDonationServices } from "../../core/interfaces/services/admin/IAdminDonationService";
import { IDonation } from "../../types/donationTypes";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { throwError } from "../../utils/resAndError";
import { Messages } from "../../constants/messages";
import { StatusCode } from "../../enums/statusCode.enum";
import { IAdminDonationResponseDto } from "../../shared/dtos/donation/donation-response.dto";
import { DonationMapper } from "../../shared/dtos/donation/donation.mapper";
@injectable()
export class AdminDonationService implements IAdminDonationServices{
    constructor(
        @inject(TYPES.DonationRepository) private _donationRepo:IDonationRepoitory
    ) { }
  async getDonation(): Promise<IAdminDonationResponseDto[]> {
    const result = await this._donationRepo.findAll();
    if (!result) {
        throwError(Messages.DONATION.FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    const sendData=result.map((i)=>DonationMapper.toAdminDonationResponseDto(i))
    return sendData;
  }
    async getFilteredDonations(
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<IAdminDonationResponseDto[]> {
       const result = await this._donationRepo.findManyWithFilter(filters, sort, skip, limit);
    if (!result) {
        throwError(Messages.DONATION.FILTERED_FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
          const sendData=result.map((i)=>DonationMapper.toAdminDonationResponseDto(i))
    return sendData;
}

  async countFilteredDonations(filters: Record<string, unknown>): Promise<number> {
    const count = await this._donationRepo.countFiltered(filters);
    if (count === undefined) {
      throwError(Messages.DONATION.COUNT_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    return count
  }
}